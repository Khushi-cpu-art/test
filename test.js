const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const rimraf = require('rimraf');

describe('Selenium Screenshot Test', function () {
  this.timeout(30000);

  let driver;
  const userDataDir = path.join(__dirname, 'tmp-chrome-profile-' + Date.now());

  before(async function () {
    // Cleanup previous profiles (optional, may fail if none)
    try {
      rimraf.sync(path.join(__dirname, 'tmp-chrome-profile-*'));
    } catch {}

    // Make sure folder does not exist (or create it)
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }

    const options = new chrome.Options()
      .addArguments(`--user-data-dir=${userDataDir}`)
      .addArguments('--no-sandbox')
      .addArguments('--disable-dev-shm-usage')
      .addArguments('--headless=new');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  it('Should load page and take screenshot', async function () {
    await driver.get('https://example.com'); // Replace with your URL
    const screenshot = await driver.takeScreenshot();

    const screenshotPath = path.join(__dirname, 'mochawesome-report', 'screenshot_01.png');

    if (!fs.existsSync(path.dirname(screenshotPath))) {
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    }

    fs.writeFileSync(screenshotPath, screenshot, 'base64');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
