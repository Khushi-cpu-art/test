const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const rimraf = require('rimraf');
const path = require('path');

describe('Selenium Screenshot Test', function () {
  this.timeout(30000);

  let driver;
  const userDataDir = path.join(__dirname, 'tmp-chrome-profile');

  before(async function () {
    // Clear previous profile data if any
    rimraf.sync(userDataDir);

    const options = new chrome.Options()
      .addArguments(`--user-data-dir=${userDataDir}`) // Unique Chrome user data dir
      .addArguments('--no-sandbox')
      .addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  it('Should load page and take screenshot', async function () {
    await driver.get('https://example.com'); // Change to your target URL

    const screenshot = await driver.takeScreenshot();
    const fs = require('fs');
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
