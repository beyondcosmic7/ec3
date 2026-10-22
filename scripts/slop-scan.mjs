import fs from "fs";
import path from "path";

const BANNED_PATTERNS = [
  // Visual & CSS slop
  { pattern: /backdrop-filter/i, name: "Glassmorphism (backdrop-filter)" },
  { pattern: /linear-gradient\([^)]*(?:#|rgb|hsl)/i, name: "Decorative Gradients (except functional scrims)" },
  { pattern: /box-shadow:\s*0\s*0\s*\d+px\s*(?:#|rgb)/i, name: "Neon Glow Effects" },
  { pattern: /transition:\s*all/i, name: "transition: all (banned - specify exact properties)" },
  
  // Template Chrome & Banned Characters
  { pattern: />\s*&rarr;|>\s*→/i, name: "Template Arrow on link (→)" },
  { pattern: /tracking-wid(?:er|est)\s+uppercase\s+text-\[?(?:10|11|12|xs)px?\]?/i, name: "Tracked All-Caps Micro-Eyebrow" },
  
  // Banned Copy Buzzwords (Section 6.5)
  { pattern: /\belevate\b/i, name: "Banned word: elevate" },
  { pattern: /\bcurated\b/i, name: "Banned word: curated" },
  { pattern: /\bseamless\b/i, name: "Banned word: seamless" },
  { pattern: /\bunlock\b/i, name: "Banned word: unlock" },
  { pattern: /\bjourney\b/i, name: "Banned word: journey" },
  { pattern: /\btimeless\b/i, name: "Banned word: timeless" },
  { pattern: /\beffortless\b/i, name: "Banned word: effortless" },
  { pattern: /\bindulge\b/i, name: "Banned word: indulge" },
  { pattern: /\bcrafted with (?:love|passion)\b/i, name: "Banned phrase: crafted with love/passion" },
  { pattern: /\bgame-changer\b/i, name: "Banned phrase: game-changer" },
  { pattern: /\bdiscover the magic\b/i, name: "Banned phrase: discover the magic" },
  { pattern: /\byour go-to\b/i, name: "Banned phrase: your go-to" },
  { pattern: /\bluxurious comfort\b/i, name: "Banned phrase: luxurious comfort" },
  { pattern: /\bLearn more\b/i, name: "Banned CTA: Learn more" },
  { pattern: /\bClick here\b/i, name: "Banned CTA: Click here" },
];

const SCAN_DIRS = ["src"];
const IGNORE_FILES = ["globals.css", "styles.css"]; // Scrim linear gradients allowed in functional scrim declarations

function scanDir(dir, violations = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (IGNORE_FILES.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath, violations);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".jsx") || file.endsWith(".js")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      BANNED_PATTERNS.forEach(({ pattern, name }) => {
        if (pattern.test(content)) {
          violations.push({ file: fullPath, violation: name });
        }
      });
    }
  }
  return violations;
}

console.log("Running Eskort Creations Slop Scan (Section 6.5)...");
let totalViolations = [];

SCAN_DIRS.forEach((d) => {
  if (fs.existsSync(d)) {
    totalViolations = scanDir(d, totalViolations);
  }
});

if (totalViolations.length > 0) {
  console.error(`\n❌ Slop Scan Failed! Found ${totalViolations.length} violations:`);
  totalViolations.forEach((v) => {
    console.error(`  - [${v.violation}] in ${v.file}`);
  });
  process.exit(1);
} else {
  console.log("✅ Slop Scan Passed! Codebase is completely free of banned design and copy cliches.");
}
