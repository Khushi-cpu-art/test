
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
require('chromedriver'); // ensures correct ChromeDriver is used

describe('Selenium Screenshot Test', function () {
  this.timeout(60000); // Allow 60s for CI startup time

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
    await driver.get('https://example.com'); // Change to your actual test URL
    console.log('Page loaded.');
  });

  it('Should load page and take screenshot', async function () {
    const screenshotPath = path.resolve(__dirname, 'mochawesome-report', 'screenshot.png');
    const screenshot = await driver.takeScreenshot();
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
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
