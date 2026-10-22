import { chromium } from "playwright";
import path from "path";

const outDir = "C:/Users/DELL/.gemini/antigravity-ide/brain/0f97e99b-b4b8-4767-b3ef-abb535e37ffd";
const baseUrl = "http://localhost:3001";

async function run() {
  console.log("Launching browser for Phase 4 Admin captures...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  // 1. Admin Dashboard - Desktop 1440x900
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    console.log("Navigating to /admin (Desktop)...");
    await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "phase4_admin_desktop_1440.png"), fullPage: false });
    await page.screenshot({ path: path.join(outDir, "phase4_admin_desktop_full.png"), fullPage: true });
    console.log("Saved: phase4_admin_desktop_1440.png & full");
    await page.close();
  }

  // 2. Admin Dashboard - Mobile 390x844
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    console.log("Navigating to /admin (Mobile)...");
    await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "phase4_admin_mobile_390.png"), fullPage: false });
    console.log("Saved: phase4_admin_mobile_390.png");
    await page.close();
  }

  // 3. Admin Orders & Fulfillment Tab - Desktop 1440x900
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    // Click Orders tab
    await page.click('button:has-text("Orders & Dispatches")');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outDir, "phase4_admin_orders_desktop.png"), fullPage: false });
    console.log("Saved: phase4_admin_orders_desktop.png");
    await page.close();
  }

  // 4. Admin CSV Ingestion & Validation Tab - Desktop 1440x900
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    // Click CSV tab
    await page.click('button:has-text("CSV Import & Export")');
    await page.waitForTimeout(800);
    // Trigger validation with a bad row to capture report
    await page.fill(
      "textarea",
      'slug,name,kind,moment,description,price_inr,mrp_inr,hsn,gst_percent,sizes,garment_measurements_in,fabric,composition,care,print_colours,stock_by_size,images,feeding_access,country_of_origin,packer_name_address\ninvalid_slug,"Test Garment",garment,"day","desc",-50,200,6204,5,"M","{}","Cotton","100% Cotton","Wash","[]","{}","img.jpg","none","India","Jaipur"'
    );
    await page.click('button:has-text("Validate & Import CSV")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "phase4_admin_csv_desktop.png"), fullPage: false });
    console.log("Saved: phase4_admin_csv_desktop.png");
    await page.close();
  }

  // 5. Add Product Rapid Drawer / Modal - Desktop 1440x900
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    await page.click('button:has-text("+ Add Product")');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, "phase4_admin_modal_desktop.png"), fullPage: false });
    console.log("Saved: phase4_admin_modal_desktop.png");
    await page.close();
  }

  await browser.close();
  console.log("All Phase 4 Admin screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
