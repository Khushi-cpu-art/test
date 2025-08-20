const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const rimraf = require('rimraf');  // Add rimraf package for recursive deletion

describe('Selenium Screenshot Test', function() {
  this.timeout(30000);
  let driver;
  let userDataDir;

  before(async () => {
    userDataDir = path.join(os.tmpdir(), 'chrome-user-data-' + Date.now() + '-' + Math.floor(Math.random() * 1000));

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
    // Clean up the user data directory after test
    if (userDataDir && fs.existsSync(userDataDir)) {
      rimraf.sync(userDataDir);
    }
  });

  it('Should load page and take screenshot', async function() {
    await driver.get('https://example.com');
    const title = await driver.getTitle();
    assert.ok(title.includes('Example'), 'Page title does not include "Example"');

    const screenshotBase64 = await driver.takeScreenshot();
    const screenshotPath = path.resolve(__dirname, 'mochawesome-report', 'screenshot_01.png');
    fs.writeFileSync(screenshotPath, screenshotBase64, 'base64');

    this.test.context = {
      title: 'Screenshot',
      value: `<img src="data:image/png;base64,${screenshotBase64}" width="600"/>`
    };
  });
});
