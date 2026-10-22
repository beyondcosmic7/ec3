import fs from "fs";
import path from "path";

const csvPath = path.join(process.cwd(), "brand", "products.csv");
const fileContent = fs.readFileSync(csvPath, "utf-8");
const lines = fileContent.split(/\r?\n/).slice(1);

let missing = 0;
let total = 0;

for (const line of lines) {
  if (!line.trim()) continue;
  // images column is at index 16
  // Or match the images pattern
  const parts = [];
  let inQuotes = false;
  let current = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  parts.push(current);

  const slug = parts[0];
  const imagesStr = parts[16] || "";
  const images = imagesStr.split(";").map((s) => s.trim()).filter(Boolean);

  for (const img of images) {
    total++;
    const fullPath = path.join(process.cwd(), "public", "brand", "products", img);
    if (!fs.existsSync(fullPath)) {
      console.error(`Missing image for ${slug}: ${fullPath}`);
      missing++;
    }
  }
}

console.log(`Checked ${total} authentic product images. Missing: ${missing}`);
if (missing > 0) {
  process.exit(1);
} else {
  console.log("All authentic images verified in public/brand/products!");
}
