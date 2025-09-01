import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const assetsDir = "./public/assets";
const outputDir = "./public/assets/optimized";

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to check if ffmpeg is available
function checkFFmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch (error) {
    console.error(
      "FFmpeg is not installed. Please install FFmpeg to optimize images."
    );
    return false;
  }
}

// Function to optimize PNG images
function optimizePNG(inputPath, outputPath) {
  try {
    // Convert to WebP with optimization
    execSync(
      `ffmpeg -i "${inputPath}" -vf "scale=64:64" -c:v libwebp -quality 80 -preset default "${outputPath.replace(
        ".png",
        ".webp"
      )}"`,
      { stdio: "ignore" }
    );
    console.log(
      `✅ Optimized: ${path.basename(inputPath)} -> ${path.basename(
        outputPath.replace(".png", ".webp")
      )}`
    );
  } catch (error) {
    console.error(`❌ Failed to optimize: ${path.basename(inputPath)}`);
  }
}

// Function to convert GIF to MP4
function convertGIFToMP4(inputPath, outputPath) {
  try {
    execSync(
      `ffmpeg -i "${inputPath}" -vf "scale=64:64,fps=15" -c:v libx264 -crf 23 -preset fast -movflags +faststart "${outputPath}"`,
      { stdio: "ignore" }
    );
    console.log(
      `✅ Converted: ${path.basename(inputPath)} -> ${path.basename(
        outputPath
      )}`
    );
  } catch (error) {
    console.error(`❌ Failed to convert: ${path.basename(inputPath)}`);
  }
}

// Main optimization function
function optimizeAssets() {
  if (!checkFFmpeg()) {
    return;
  }

  console.log("🚀 Starting asset optimization...\n");

  // Get all files in assets directory
  const files = fs.readdirSync(assetsDir);

  // Process PNG files
  const pngFiles = files.filter((file) => file.endsWith(".png"));
  console.log(`📸 Found ${pngFiles.length} PNG files to optimize:`);

  pngFiles.forEach((file) => {
    const inputPath = path.join(assetsDir, file);
    const outputPath = path.join(outputDir, file);
    optimizePNG(inputPath, outputPath);
  });

  // Process GIF files
  const gifFiles = files.filter((file) => file.endsWith(".gif"));
  console.log(`\n🎬 Found ${gifFiles.length} GIF files to convert:`);

  gifFiles.forEach((file) => {
    const inputPath = path.join(assetsDir, file);
    const outputPath = path.join(outputDir, file.replace(".gif", ".mp4"));
    convertGIFToMP4(inputPath, outputPath);
  });

  console.log("\n✨ Asset optimization completed!");
  console.log("📁 Optimized files are in:", outputDir);
  console.log("\n📋 Next steps:");
  console.log("1. Replace original files with optimized versions");
  console.log("2. Update component imports to use WebP/MP4 files");
  console.log("3. Test the application to ensure everything works");
}

// Run optimization
optimizeAssets();
