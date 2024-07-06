/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";
import { fileURLToPath } from "url";
import sizeOf from "image-size";
import * as exif from "@ginpei/exif-orientation";

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
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const galleryPath = path.join(__dirname, "..", "assets", "gallery");

function sort_by_create(a, b) {
  let aStat = fs.statSync(path.join(galleryPath, a)),
    bStat = fs.statSync(path.join(galleryPath, b));

  return (
    new Date(bStat.birthtime).getTime() - new Date(aStat.birthtime).getTime()
  );
}

// only for mac
if (process.platform === "darwin") {
  // fsExtra.emptyDirSync(path.join(process.cwd(), "public", "gallery"));

  // List files in directory
  var galleryInYears = fs.readdirSync(galleryPath);
  galleryInYears = galleryInYears.sort(sort_by_create).filter(function (e) {
    return e !== ".DS_Store";
  });

  const galleryFileMetadatas = {};

  // process.exit(0);

  const pm = [];
  // for (let i = 0; i < galleryInYears.length; i++) {
  //   const year = galleryInYears[i];
  //   if (year.startsWith(".")) {
  //     continue;
  //   }
  //   console.log("Processing year: ", year);
  //   const rs = imagemin([path.join(galleryPath, year, "*.{JPG,jpg,png,NEF}")], {
  //     destination: path.join(process.cwd(), "public", "gallery", year),
  //     plugins: [
  //       imageminJpegAutorotate({
  //         disable: false,
  //       }),
  //       imageminWebp({ quality: 80, preset: "photo" }),
  //     ],
  //   }).then(() => {
  //     console.log("Year processed: ", year);
  //   });
  //   pm.push(rs);
  // }

  Promise.all(pm).then(
    async () => {
      console.log("All images are processed");
      for (let i = 0; i < galleryInYears.length; i++) {
        const year = galleryInYears[i];
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
            // read file as buffer
            const buffer = fs.readFileSync(filePath);
            // get orientation
            const orientation = await exif.getOrientation(buffer);
            var w = size.width;
            var h = size.height;
            if (orientation !== undefined) {
              if (orientation.rotation === 90 || orientation.rotation === 270) {
                w = size.height;
                h = size.width;
              }
            }
            galleryFileMetadatas[year].push({
              id: year + "-" + j,
              src: "/gallery/" + year + "/" + fileName,
              width: w,
              height: h,
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
      // Save file names to a json file
      const galleryListJsonPath = path.join(
        process.cwd(),
        "public",
        "gallery_list.json"
      );
      const galleryFileMetadatasArrWithDate = [];

      for (let i = 0; i < galleryInYears.length; i++) {
        const year = galleryInYears[i];
        var sYear = fs.statSync(path.join(galleryPath, year));
        galleryFileMetadatasArrWithDate.push({
          birthtime: new Date(sYear.birthtime).getTime(),
          data: galleryFileMetadatas[year],
          year: year,
        });
      }

      fs.writeFileSync(
        galleryListJsonPath,
        JSON.stringify(galleryFileMetadatasArrWithDate, null, 4),
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
