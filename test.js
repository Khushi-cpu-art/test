const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Selenium Screenshot Test', function() {
  this.timeout(30000);
  let driver;

  before(async () => {
    // Create unique temp user data dir for this session
    const userDataDir = path.resolve(__dirname, 'chrome-user-data-' + Date.now());

    let options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userDataDir}`);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should load page and take screenshot', async function() {
    await driver.get('https://example.com');
    const title = await driver.getTitle();
    assert.ok(title.includes('Example'), 'Page title does not include "Example"');

    // Take screenshot as base64
    const screenshotBase64 = await driver.takeScreenshot();

    // Save screenshot as PNG file (relative to project root)
    const screenshotPath = path.resolve(__dirname, 'mochawesome-report', 'screenshot_01.png');
    fs.writeFileSync(screenshotPath, screenshotBase64, 'base64');

    // Embed screenshot in Mochawesome report context (rendered as image)
    this.test.context = {
      title: 'Screenshot',
      value: `<img src="data:image/png;base64,${screenshotBase64}" width="600"/>`
    };
  });
});
