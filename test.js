const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');
const os = require('os');
const assert = require('assert');

describe('Selenium Screenshot Test', function() {
  let driver;
  this.timeout(30000);

  before(async function() {
    // Create a unique temporary directory for Chrome user data
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-user-data-'));

    let options = new chrome.Options();
    options.addArguments(
      '--headless=new', // Use headless mode (new Chrome headless)
      '--no-sandbox',
      '--disable-dev-shm-usage',
      `--user-data-dir=${tmpDir}`
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should load page and take screenshot', async function() {
    await driver.get('https://example.com');
    const title = await driver.getTitle();
    assert.ok(title.includes('Example'), 'Page title does not include "Example"');

    const screenshotBase64 = await driver.takeScreenshot();

    this.test.context = {
      title: 'Screenshot',
      value: `<img src="data:image/png;base64,${screenshotBase64}" width="400"/>`
    };
  });
});
