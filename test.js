const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

describe('Selenium Screenshot Test', function () {
  this.timeout(30000); // increase timeout because browser setup can be slow

  let driver;

  before(async function () {
    const userDataDir = path.join(os.tmpdir(), 'chrome-user-data-' + Date.now());

    const options = new chrome.Options();
    options.addArguments(
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      `--user-data-dir=${userDataDir}`
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get('https://example.com');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should load page and take screenshot', async function () {
    const screenshotDir = path.resolve(__dirname, 'mochawesome-report');
    const screenshotPath = path.join(screenshotDir, 'screenshot_01.png');

    // Make sure directory exists
    fs.mkdirSync(screenshotDir, { recursive: true });

    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, screenshot, 'base64');

    // Attach screenshot to Mochawesome context
    if (this.test && this.test.context) {
      this.test.context.attach = {
        title: 'Screenshot',
        value: 'screenshot_01.png',
      };
    } else if (this.test) {
      this.test.context = {
        title: 'Screenshot',
        value: 'screenshot_01.png',
      };
    }

    // Just a basic assertion that page title contains "Example"
    const title = await driver.getTitle();
    assert.ok(title.includes('Example'), 'Page title does not include "Example"');
  });
});
