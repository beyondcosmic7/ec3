import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:/Users/DELL/.gemini/antigravity-ide/brain/8dea8778-59cf-470d-b671-706195ae18ac";
const BASE_URL = "http://localhost:3001";

async function capture() {
  console.log("Launching browser via msedge channel...");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const targets = [
    // Home Page
    { url: `${BASE_URL}/`, name: "phase2_home_desktop_1440.png", width: 1440, height: 900 },
    { url: `${BASE_URL}/`, name: "phase2_home_tablet_768.png", width: 768, height: 1024 },
    { url: `${BASE_URL}/`, name: "phase2_home_mobile_390.png", width: 390, height: 844 },
    // Shop Page
    { url: `${BASE_URL}/shop`, name: "phase2_shop_desktop_1440.png", width: 1440, height: 900 },
    { url: `${BASE_URL}/shop`, name: "phase2_shop_mobile_390.png", width: 390, height: 844 },
    // Product Detail Page
    { url: `${BASE_URL}/product/ekc-1501-banarasi-silk-3piece-set`, name: "phase2_pdp_desktop_1440.png", width: 1440, height: 900 },
    { url: `${BASE_URL}/product/ekc-1501-banarasi-silk-3piece-set`, name: "phase2_pdp_mobile_390.png", width: 390, height: 844 },
    // Contact & Policy Page
    { url: `${BASE_URL}/contact`, name: "phase2_contact_desktop_1440.png", width: 1440, height: 900 },
  ];

  for (const t of targets) {
    const page = await browser.newPage({
      viewport: { width: t.width, height: t.height },
    });
    console.log(`Navigating to ${t.url} (${t.width}x${t.height})...`);
    await page.goto(t.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(600); // allow fonts & view transitions to settle

    const outPath = path.join(ARTIFACT_DIR, t.name);
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot: ${outPath}`);
    await page.close();
  }

  await browser.close();
  console.log("All Phase 2 storefront screenshots captured successfully!");
}

capture().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
