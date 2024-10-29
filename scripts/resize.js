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
let allFiles = getAllFiles(path.join(__dirname, ".."));

// Filter for .png files
let pngFiles = allFiles.filter(
  (file) => path.extname(file).toLowerCase() === ".png"
);

console.log("Found", pngFiles.length, "png files");

const resize = () => {
  // Process each .png file
  pngFiles.forEach(async (file) => {
    const inputPath = file;
    const outputPath = path.join(
      path.dirname(file),
      "_resized_" + path.basename(file)
    );

    try {
      const metadata = await sharp(inputPath).metadata();
      const newWidth = Math.round(0.25 * metadata.width);

      // Resize image to 25%
      await sharp(inputPath).resize({ width: newWidth }).toFile(outputPath);
    } catch (err) {
      console.error("Error processing image:", err);
    }
  });
};

const clean = () => {
  pngFiles.forEach(async (file) => {
    const inputPath = file;

    if (!file.includes("_resized_")) {
      fs.unlinkSync(inputPath);
    }
  });
};

const rename = () => {
  pngFiles.forEach(async (file) => {
    const inputPath = file;
    const outputPath = path.join(
      path.dirname(file),
      path.basename(file).replace("_resized_", "")
    );

    fs.renameSync(inputPath, outputPath);
  });
};

// resize();
// clean();
rename();
