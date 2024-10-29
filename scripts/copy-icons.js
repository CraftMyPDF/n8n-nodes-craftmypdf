const path = require("node:path");
const fs = require("node:fs");

const iconExtensions = [".png", ".svg"];

function copyIcons(sourceDir, destinationDir) {
  fs.mkdirSync(destinationDir, { recursive: true });
  const files = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file.name);
    const destinationPath = path.join(destinationDir, file.name);

    if (file.isDirectory()) {
      // Recursively copy if it's a directory
      copyIcons(sourcePath, destinationPath);
    } else if (iconExtensions.includes(path.extname(file.name))) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

// Copy icons from 'nodes' folder to 'dist/nodes' folder
const nodeSource = path.resolve("nodes");
const nodeDestination = path.resolve("dist", "nodes");
copyIcons(nodeSource, nodeDestination);

// Copy icons from 'credentials' folder to 'dist/credentials' folder
const credSource = path.resolve("credentials");
const credDestination = path.resolve("dist", "credentials");
copyIcons(credSource, credDestination);
