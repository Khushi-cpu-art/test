const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

describe('Selenium Screenshot Test', function () {
  this.timeout(30000);  // increase timeout if needed

  let driver;
  const screenshotDir = path.join(__dirname, 'mochawesome-report');
  const screenshotPath = path.join(screenshotDir, 'screenshot_01.png');

  before(async function () {
    // Ensure report directory exists
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Create unique user-data-dir
    const userDataDir = path.join(os.tmpdir(), 'chrome-user-data-' + Date.now());
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }

    // Set Chrome options with unique user-data-dir
    let options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments('--headless=new');  // headless Chrome (new mode)
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  it('Should load page and take screenshot', async function () {
    await driver.get('https://www.google.com');
    const title = await driver.getTitle();
    assert.strictEqual(title, 'Google');

    // Take screenshot
    const image = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, image, 'base64');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
