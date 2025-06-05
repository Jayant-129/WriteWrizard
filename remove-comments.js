#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Function to remove comments from different file types
function removeComments(content, fileType) {
  switch (fileType) {
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
      // Remove single-line comments
      content = content.replace(/\/\/.*$/gm, "");
      // Remove multi-line comments
      content = content.replace(/\/\*[\s\S]*?\*\//g, "");
      break;
    case "css":
      // Remove CSS comments
      content = content.replace(/\/\*[\s\S]*?\*\//g, "");
      break;
    case "html":
      // Remove HTML comments
      content = content.replace(/<!--[\s\S]*?-->/g, "");
      break;
  }

  // Clean up extra whitespace and empty lines
  content = content.replace(/^\s*\n/gm, "");
  content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

  return content;
}

// Function to get file extension
function getFileType(filename) {
  const ext = path.extname(filename).slice(1);
  return ext;
}

// Function to process files recursively
function processDirectory(dirPath, exclude = []) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (
        !exclude.includes(item) &&
        !item.startsWith(".") &&
        item !== "node_modules"
      ) {
        processDirectory(fullPath, exclude);
      }
    } else if (stat.isFile()) {
      const fileType = getFileType(item);

      if (["js", "ts", "jsx", "tsx", "css", "html"].includes(fileType)) {
        console.log(`Processing: ${fullPath}`);

        const content = fs.readFileSync(fullPath, "utf8");
        const cleanedContent = removeComments(content, fileType);

        if (content !== cleanedContent) {
          fs.writeFileSync(fullPath, cleanedContent, "utf8");
          console.log(`✓ Cleaned: ${fullPath}`);
        }
      }
    }
  }
}

// Start processing from current directory
const rootDir = process.cwd();
const excludeDirs = ["node_modules", ".git", ".next", "dist", "build"];

console.log("Starting comment removal...");
processDirectory(rootDir, excludeDirs);
console.log("Comment removal completed!");
