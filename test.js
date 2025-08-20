const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

let driver;
const screenshotPath = path.join(__dirname, 'mochawesome-report', 'screenshot_01.png');

describe('Selenium Screenshot Test', function () {
  this.timeout(30000); // 30 seconds timeout for setup

  before(async function () {
    // Create unique user data dir to avoid session conflicts
    const userDataDir = path.join(os.tmpdir(), `chrome-user-data-${Date.now()}-${Math.floor(Math.random() * 10000)}`);

    // Remove dir if somehow exists
    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    }

    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    // options.addArguments('--headless'); // Uncomment if you want headless mode

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().setRect({ width: 1200, height: 800 });
  });

  it('Should load page and take screenshot', async function () {
    await driver.get('https://khushi-cpu-art.vercel.app/');

    // Wait a bit for the page to load
    await driver.sleep(3000);

    const image = await driver.takeScreenshot();

    // Ensure report directory exists
    const reportDir = path.dirname(screenshotPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(screenshotPath, image, 'base64');

    // Simple check if image saved (size > 0)
    const stats = fs.statSync(screenshotPath);
    assert(stats.size > 0, 'Screenshot file is empty');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
