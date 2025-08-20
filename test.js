const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
require('chromedriver');

describe('Selenium Screenshot Test', function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--no-sandbox');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get('https://example.com');
  });

  it('Should load page and take screenshot', async function () {
    const screenshotDir = path.resolve(__dirname, 'mochawesome-report');
    const screenshotFile = 'screenshot_01.png';
    const screenshotPath = path.join(screenshotDir, screenshotFile);

    fs.mkdirSync(screenshotDir, { recursive: true });

    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, screenshot, 'base64');

    // ✅ Embed screenshot in the HTML report using <img>
    this.test.context = {
      title: 'Screenshot',
      value: `<img src="${screenshotFile}" width="400"/>`
    };
  });

  after(async function () {
    if (driver) await driver.quit();
  });
});
