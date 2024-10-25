const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  console.log("Reading directory:", dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

// Get all files recursively
const allFiles = getAllFiles(path.join(__dirname, ".."));

// Filter for .png files
const pngFiles = allFiles.filter(
  (file) => path.extname(file).toLowerCase() === ".png"
);

console.log("Found", pngFiles.length, "png files");

// Process each .png file
pngFiles.forEach(async (file) => {
  const inputPath = file;
  const outputPath = path.join(
    path.dirname(file),
    path.basename(file).replace("resized_", "")
  );

  fs.renameSync(inputPath, outputPath);

  //   try {
  //     const metadata = await sharp(inputPath).metadata();
  //     const newWidth = Math.round(0.25 * metadata.width);

  //     // Resize image to 25%
  //     await sharp(inputPath).resize({ width: newWidth }).toFile(outputPath);
  //   } catch (err) {
  //     console.error("Error processing image:", err);
  //   }
});
