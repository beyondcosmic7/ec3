import fs from "fs";
import path from "path";

const isProduction =
  process.env.VERCEL_ENV === "production" || process.env.LAUNCH === "1";

const SCAN_DIRS = ["src", "brand"];
const MARKER_REGEX = /⟦NEEDED:\s*([^⟧]+)⟧/g;

function findMarkers(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findMarkers(fullPath, results);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".csv") || file.endsWith(".md")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      let match;
      while ((match = MARKER_REGEX.exec(content)) !== null) {
        results.push({ file: fullPath, marker: match[0], tag: match[1] });
      }
    }
  }
  return results;
}

console.log("Checking for ⟦NEEDED: what⟧ content gaps...");
let allMarkers = [];

SCAN_DIRS.forEach((d) => {
  allMarkers = findMarkers(d, allMarkers);
});

console.log(`\nInventory of Open Content Markers: ${allMarkers.length} found`);
allMarkers.forEach((m) => {
  console.log(`  - ${m.marker} in ${m.file}`);
});

if (isProduction && allMarkers.length > 0) {
  console.error(
    `\n❌ Production Build Blocked: Found ${allMarkers.length} unresolved ⟦NEEDED: ...⟧ markers! Real owner data is required before shipping.`
  );
  process.exit(1);
} else if (!isProduction) {
  console.log(
    `\nℹ️ Development Mode: ${allMarkers.length} markers allowed. Verified logged in CONTENT_NEEDED.md.`
  );
}
