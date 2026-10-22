import { chromium } from 'playwright';
import path from 'path';

const outDir = 'C:/Users/DELL/.gemini/antigravity-ide/brain/8dea8778-59cf-470d-b671-706195ae18ac';
const baseUrl = 'http://localhost:3001';

async function run() {
  const browser = await chromium.launch({ headless: true });

  // 1. Home - Desktop 1440x900
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, 'phase2_home_desktop_1440.png'), fullPage: false });
    await page.screenshot({ path: path.join(outDir, 'phase2_home_desktop_full.png'), fullPage: true });
    await page.close();
  }

  // 2. Home - Tablet 768x1024
  {
    const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, 'phase2_home_tablet_768.png'), fullPage: false });
    await page.close();
  }

  // 3. Home - Mobile 390x844
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, 'phase2_home_mobile_390.png'), fullPage: false });
    await page.close();
  }

  // 4. Shop - Desktop 1440x900
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/shop`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, 'phase2_shop_desktop_1440.png'), fullPage: false });
    await page.close();
  }

  // 5. Shop - Mobile 390x844
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await page.goto(`${baseUrl}/shop`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, 'phase2_shop_mobile_390.png'), fullPage: false });
    await page.close();
  }

  // 6. PDP - Desktop 1440x900
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/product/ekc-1501-banarasi-silk-3piece-set`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, 'phase2_pdp_desktop_1440.png'), fullPage: false });
    await page.close();
  }

  // 7. PDP - Mobile 390x844
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await page.goto(`${baseUrl}/product/ekc-1501-banarasi-silk-3piece-set`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, 'phase2_pdp_mobile_390.png'), fullPage: false });
    await page.close();
  }

  await browser.close();
  console.log('Phase 2 screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
