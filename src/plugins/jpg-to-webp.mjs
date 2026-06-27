import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import cliProgress from "cli-progress";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const galleryPath = path.join(__dirname, "..", "assets", "gallery");
const outputBase = path.join(process.cwd(), "public", "gallery");

const years = fs.readdirSync(galleryPath).filter((e) => !e.startsWith("."));

for (const year of years) {
  const src = path.join(galleryPath, year);
  if (!fs.statSync(src).isDirectory()) continue;

  const dest = path.join(outputBase, year);
  fs.mkdirSync(dest, { recursive: true });

  const sourceFiles = fs
    .readdirSync(src)
    .filter((f) => /\.(JPG|jpg|jpeg|png)$/i.test(f));

  const sourceWebpNames = new Set(
    sourceFiles.map((f) => f.replace(/\.[^.]+$/, ".webp"))
  );

  const existingWebps = fs.readdirSync(dest).filter((f) => f.endsWith(".webp"));

  for (const webp of existingWebps) {
    if (!sourceWebpNames.has(webp)) {
      fs.unlinkSync(path.join(dest, webp));
      console.log(`Deleted: ${year}/${webp}`);
    }
  }

  const existingWebpSet = new Set(existingWebps);
  const toConvert = sourceFiles.filter(
    (f) => !existingWebpSet.has(f.replace(/\.[^.]+$/, ".webp"))
  );
  const skipped = sourceFiles.length - toConvert.length;

  if (toConvert.length === 0) {
    console.log(`${year}: all ${skipped} skipped`);
    continue;
  }

  const bar = new cliProgress.SingleBar(
    {
      format: `${year} [{bar}] {value}/{total} | skip: ${skipped} | {filename}`,
      clearOnComplete: false,
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );
  bar.start(toConvert.length, 0, { filename: "" });

  await Promise.all(
    toConvert.map(async (f) => {
      const webpName = f.replace(/\.[^.]+$/, ".webp");
      await sharp(path.join(src, f))
        .rotate()
        .webp({ quality: 100 })
        .toFile(path.join(dest, webpName));
      bar.increment({ filename: f });
    })
  );

  bar.stop();
}

console.log("All done.");
