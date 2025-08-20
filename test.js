const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');
const rimraf = require('rimraf');

let driver;

describe('Selenium Screenshot Test', function() {
  this.timeout(30000);

  before(async function () {
    const userDataDir = path.join(os.tmpdir(), `chrome-user-data-${Date.now()}-${Math.floor(Math.random() * 10000)}`);

    // Clean any leftover folder forcibly
    if (fs.existsSync(userDataDir)) {
      rimraf.sync(userDataDir);
    }

    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().setRect({ width: 1200, height: 800 });
  });

  it('Should load page and take screenshot', async function () {
    await driver.get('https://your-website-url.com');  // Change to your actual URL

    // Wait for some element to ensure page loaded (adjust selector as needed)
    await driver.wait(until.elementLocated(By.tagName('body')), 10000);

    const screenshot = await driver.takeScreenshot();

    // Save screenshot locally
    const screenshotPath = path.join(__dirname, 'mochawesome-report', 'screenshot_01.png');
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
