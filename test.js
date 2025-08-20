const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Selenium Screenshot Test', function () {
  this.timeout(30000); // Allow enough time for page load

  let driver;

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--no-sandbox');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  it('Should load page and take screenshot', async function () {
    // Open the website
    await driver.get('https://theysaidso.com');

    // Wait for the page to load and check title
    const title = await driver.getTitle();
    console.log('Page title is:', title);
    assert.ok(title.includes('They Said So'), 'Page title does not include "They Said So"');

    // Set up screenshot directory and file
    const screenshotDir = path.resolve(__dirname, 'mochawesome-report');
    const screenshotPath = path.join(screenshotDir, 'screenshot_01.png');

    fs.mkdirSync(screenshotDir, { recursive: true });
    const image = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, image, 'base64');

    // Attach screenshot to mochawesome (optional)
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
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
