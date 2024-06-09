/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";
import { fileURLToPath } from "url";
import sizeOf from "image-size";

// copy all images to public
// const webp = require("webp-converter");
// const sizeOf = require("image-size");
// webp.grant_permission();

import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import imageminJpegAutorotate from "imagemin-jpeg-autorotate";

// const files = imagemin(
//   [
//     "/Users/yinnnyou/workspace/youyinnn.github.io/src/assets/gallery/2024/*.{JPG,png}",
//   ],
//   {
//     destination: "build/images",
//     plugins: [
//       imageminJpegAutorotate({
//         disable: false,
//       }),
//       imageminWebp({ quality: 80, metadata: "all", preset: "photo" }),
//     ],
//   }
// );

// only for mac
if (process.platform === "darwin") {
  fsExtra.emptyDirSync(path.join(process.cwd(), "public", "gallery"));
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const galleryPath = path.join(__dirname, "..", "assets", "gallery");

  // List files in directory
  const galleryInYears = fs.readdirSync(galleryPath);
  const galleryFileMetadatas = {};

  const pm = [];
  for (let i = 0; i < galleryInYears.length; i++) {
    var year = galleryInYears[i];
    if (year.startsWith(".")) {
      continue;
    }
    console.log("Processing year: ", year);

    const rs = imagemin([path.join(galleryPath, year, "*.{JPG,jpg,png,NEF}")], {
      destination: path.join(process.cwd(), "public", "gallery", year),
      plugins: [
        imageminJpegAutorotate({
          disable: false,
        }),
        imageminWebp({ quality: 80, preset: "photo" }),
      ],
    }).then(() => {
      console.log("Year processed: ", year);
    });
    pm.push(rs);
  }

  Promise.all(pm).then(
    () => {
      console.log("All images are processed");
      for (let i = 0; i < galleryInYears.length; i++) {
        var year = galleryInYears[i];
        if (year.startsWith(".")) {
          continue;
        }

        galleryFileMetadatas[year] = [];
        const galleryOfYear = fs.readdirSync(path.join(galleryPath, year));
        for (let j = 0; j < galleryOfYear.length; j++) {
          var file = galleryOfYear[j];
          // console.log(year, file);
          const filePath = path.join(galleryPath, year, file);
          if (fs.lstatSync(filePath).isFile() && !file.startsWith(".")) {
            var fileName = file.split(".")[0] + ".webp";
            var size = sizeOf(filePath);
            const creationDate = fs.statSync(filePath).birthtime;
            galleryFileMetadatas[year].push({
              id: year + "-" + j,
              src: "/gallery/" + year + "/" + fileName,
              size: size.width + "-" + size.height,
              month: creationDate.getMonth() + 1,
              day: creationDate.getDate(),
              year: creationDate.getFullYear(),
              time: Math.floor(creationDate.getTime() / 1000),
            });
          }
          galleryFileMetadatas[year].sort((a, b) => {
            return a.time - b.time;
          });
        }
      }
      // Save file names to a txt file
      const galleryListJsonPath = path.join(
        process.cwd(),
        "public",
        "gallery_list.json"
      );
      fs.writeFileSync(
        galleryListJsonPath,
        JSON.stringify(galleryFileMetadatas, null, 4),
        {
          encoding: "utf-8",
        }
      );
    },
    (err) => {
      console.log("Error: ", err);
    }
  );
}
