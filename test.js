const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

describe('Selenium Screenshot Test', function() {
  this.timeout(30000); // 30 seconds timeout for setup and test

  let driver;
  const screenshotPath = path.join(__dirname, 'mochawesome-report', 'screenshot_01.png');

  before(async function() {
    // Chrome options with no user-data-dir to avoid session issues
    const options = new chrome.Options();
    // Add headless if needed: options.headless();

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().setRect({ width: 1200, height: 800 });

    // Navigate to your desired URL (replace with your actual test URL)
    await driver.get('https://khushi-cpu-art.vercel.app/');
  });

  it('Should load page and take screenshot', async function() {
    // Wait until body element is loaded
    await driver.wait(until.elementLocated(By.css('body')), 10000);

    // Take screenshot
    const image = await driver.takeScreenshot();

    // Ensure directory exists
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });

    // Save screenshot as PNG file
    fs.writeFileSync(screenshotPath, image, 'base64');

    // Attach screenshot to Mochawesome report
    this.test.context = `![Screenshot](./screenshot_01.png)`;
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });
});
