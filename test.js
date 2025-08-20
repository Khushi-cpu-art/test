const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

require('mocha');

describe('Selenium Screenshot Test', function () {
  this.timeout(60000); // 60 seconds timeout for slow CI environments

  let driver;

  before(async function () {
    console.log('Starting Selenium WebDriver...');
    
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--no-sandbox');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    console.log('Navigating to page...');
    await driver.get('https://example.com'); // Change this URL to your target

    console.log('Page loaded.');
  });

  it('Should load page and take screenshots', async function () {
    const screenshotPath = path.resolve(__dirname, 'screenshot.png');

    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    console.log(`Screenshot saved to ${screenshotPath}`);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('Browser closed.');
    }
  });
});
