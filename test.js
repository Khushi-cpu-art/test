const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const os = require('os');
const path = require('path');

const screenshotDir = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, name) {
  const img = await driver.takeScreenshot();
  const p = path.join(screenshotDir, `${name}.png`);
  fs.writeFileSync(p, img, 'base64');
  console.log(`Screenshot saved: ${p}`);
}

describe('Selenium Test with Dynamic Profile', function () {
  this.timeout(60000);
  let driver;
  before(async function () {
    const tempDir = path.join(os.tmpdir(), `chrome_profile_${Date.now()}`);
    let options = new chrome.Options()
      .addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage')
      .addArguments(`--user-data-dir=${tempDir}`);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should load the site and take screenshots', async function () {
    await driver.get('https://theysaidso.com/');
    await saveScreenshot(driver, 'homepage');
  });
});
