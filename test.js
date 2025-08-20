const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');

describe('Selenium Screenshot Test', function () {
  this.timeout(30000);
  let driver;

  // Helper function to save screenshots
  async function saveScreenshot(driver, filename) {
    const image = await driver.takeScreenshot();
    await fs.writeFile(path.join(__dirname, filename), image, 'base64');
  }

  before(async function () {
    // Setup ChromeDriver using the local chromedriver.exe
    const service = new chrome.ServiceBuilder('./chromedriver.exe');
    const options = new chrome.Options();

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should load page and take screenshots', async function () {
    // Navigate to the page
    await driver.get('https://theysaidso.com/');
    await driver.manage().window().setRect({ width: 1054, height: 800 });

    // Take screenshot before scroll
    await saveScreenshot(driver, 'screenshot_01.png');

    // Scroll down and take another screenshot
    await driver.executeScript('window.scrollTo(0,512)');
    await saveScreenshot(driver, 'screenshot_02.png');
  });
});
