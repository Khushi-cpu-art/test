const path = require('path');
const fs = require('fs');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Selenium Screenshot Test', function () {
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

  after(async function () {
    if (driver) await driver.quit();
  });

  it('Should load page and take screenshot', async function () {
    // Define screenshot folder inside mochawesome-report
    const screenshotDir = path.resolve(__dirname, 'mochawesome-report');
    const screenshotFile = 'screenshot_01.png';
    const screenshotPath = path.join(screenshotDir, screenshotFile);

    // Ensure directory exists
    fs.mkdirSync(screenshotDir, { recursive: true });

    // Take screenshot
    const screenshot = await driver.takeScreenshot();

    // Save screenshot file in base64
    fs.writeFileSync(screenshotPath, screenshot, 'base64');

    // Attach screenshot to mochawesome report context with relative path
    this.test.context = {
      title: 'Screenshot',
      value: `<img src="${screenshotFile}" width="400"/>`
    };

    // Optional: basic check
    assert.ok(screenshot.length > 0, 'Screenshot should not be empty');
  });
});
