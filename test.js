const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const os = require('os');
const path = require('path');
const addContext = require('mochawesome/addContext');

const screenshotDir = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, name) {
  const img = await driver.takeScreenshot();
  const p = path.join(screenshotDir, `${name}.png`);
  fs.writeFileSync(p, img, 'base64');
  console.log(`Screenshot saved: ${p}`);
  return p;  // Return full path for further use
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

  it('should load the site and take screenshots for every step', async function () {
    await driver.get('https://theysaidso.com/');

    // Step 1 - homepage
    let screenshotPath = await saveScreenshot(driver, 'homepage');
    addContext(this, path.relative(screenshotDir, screenshotPath));

    // Example additional step - wait 2 seconds
    await driver.sleep(2000);
    screenshotPath = await saveScreenshot(driver, 'after-wait');
    addContext(this, path.relative(screenshotDir, screenshotPath));

    // Example final step
    screenshotPath = await saveScreenshot(driver, 'final-step');
    addContext(this, path.relative(screenshotDir, screenshotPath));
  });
});
