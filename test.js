const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Selenium Screenshot Test', function() {
  this.timeout(30000);

  let driver;
  const screenshotPath = path.join(__dirname, 'mochawesome-report', 'screenshot_01.png');

  before(async function() {
    // Create a unique temp directory for Chrome user data
    const userDataDir = path.join(os.tmpdir(), `chrome-user-data-${Date.now()}`);

    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userDataDir}`);
    // options.addArguments('--headless'); // optional

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().setRect({ width: 1200, height: 800 });
    await driver.get('https://khushi-cpu-art.vercel.app/');
  });

  it('Should load page and take screenshot', async function() {
    await driver.wait(until.elementLocated(By.css('body')), 10000);

    const image = await driver.takeScreenshot();

    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    fs.writeFileSync(screenshotPath, image, 'base64');

    this.test.context = `![Screenshot](./screenshot_01.png)`;
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });
});
