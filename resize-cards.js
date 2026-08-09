import sharp from "sharp";
import fs from "fs";

const dir = "./new-photos";
const outDir = "./public/images/homepage/treatment-cards";

fs.readdirSync(dir).forEach(async (file) => {
  await sharp(`${dir}/${file}`)
    .resize(640, 480, { fit: "cover" })
    .png({ quality: 80 })
    .toFile(`${outDir}/${file}`);
});