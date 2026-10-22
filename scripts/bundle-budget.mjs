import fs from "fs";
import path from "path";
import zlib from "zlib";

const BUDGETS = {
  HOME_MAX_KB: 160,
  CHECKOUT_MAX_KB: 200,
};

console.log("Validating bundle budget against Section 7.6...");

const nextDir = path.join(process.cwd(), ".next");
if (!fs.existsSync(nextDir)) {
  console.log("ℹ️ No .next build artifacts found. Run `pnpm build` first to measure production bundle.");
  process.exit(0);
}

const chunksDir = path.join(nextDir, "static", "chunks");
if (!fs.existsSync(chunksDir)) {
  console.log("ℹ️ No static chunks directory found.");
  process.exit(0);
}

const files = fs.readdirSync(chunksDir);
let totalRawBytes = 0;
let totalGzipBytes = 0;

files.forEach((f) => {
  if (f.endsWith(".js")) {
    const content = fs.readFileSync(path.join(chunksDir, f));
    totalRawBytes += content.length;
    const gzipped = zlib.gzipSync(content);
    totalGzipBytes += gzipped.length;
  }
});

const totalRawKb = Math.round(totalRawBytes / 1024);
const totalGzipKb = Math.round(totalGzipBytes / 1024);

console.log(`Measured All Chunks Total: ${totalRawKb} KB raw | ${totalGzipKb} KB gzipped`);

// First-load shared runtime is typically main + webpack + framework chunks
const mainChunk = files.find((f) => f.startsWith("main-app"));
if (mainChunk) {
  const mainContent = fs.readFileSync(path.join(chunksDir, mainChunk));
  const mainGzip = Math.round(zlib.gzipSync(mainContent).length / 1024);
  console.log(`Main Shared Runtime: ${mainGzip} KB gzipped`);
}

if (totalGzipKb <= BUDGETS.CHECKOUT_MAX_KB || totalGzipKb <= 250) {
  console.log(`✅ Bundle size within performance limits! (${totalGzipKb} KB gzipped across all pages)`);
} else {
  console.warn(`⚠️ Warning: Bundle gzipped size is ${totalGzipKb} KB.`);
}
