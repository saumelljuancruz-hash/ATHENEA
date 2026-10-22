const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const [, , input, output] = process.argv;
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(input), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: output, preferCSSPageSize: true, printBackground: true });
  await browser.close();
})();
