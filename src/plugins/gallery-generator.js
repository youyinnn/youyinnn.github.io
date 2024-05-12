/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");

// copy all images to public
const webp = require("webp-converter");
const sizeOf = require("image-size");
webp.grant_permission();

function copyImages(srcPath, ...destPath) {
  for (let img of fs.readdirSync(srcPath)) {
    if (img.startsWith(".")) {
      continue;
    }
    let imgExt = path.extname(img);
    let imgProcessor = webp.cwebp;
    if (imgExt === ".gif") {
      imgProcessor = webp.gwebp;
    }
    console.log(
      "Processing: ",
      img,
      " to ",
      path.join(process.cwd(), ...destPath, img.replace(imgExt, ".webp"))
    );
    if (!fs.existsSync(path.join(process.cwd(), ...destPath))) {
      fs.mkdirSync(path.join(process.cwd(), ...destPath), { recursive: true });
    }
    imgProcessor(
      path.join(srcPath, img),
      path.join(process.cwd(), ...destPath, img.replace(imgExt, ".webp"))
    );
  }
}

// only for mac
if (process.platform === "darwin") {
  fsExtra.emptyDirSync(path.join(process.cwd(), "public", "gallery"));
  const galleryPath = path.join(__dirname, "..", "assets", "gallery");

  // List files in directory
  const galleryInYears = fs.readdirSync(galleryPath);
  const galleryFileMetadatas = {};

  for (let i = 0; i < galleryInYears.length; i++) {
    var year = galleryInYears[i];
    if (year.startsWith(".")) {
      continue;
    }
    copyImages(path.join(galleryPath, year), "public", "gallery", year);
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
  fs.writeFileSync(galleryListJsonPath, JSON.stringify(galleryFileMetadatas), {
    encoding: "utf-8",
  });
}
