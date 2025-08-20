const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');

describe('yesttt', function () {
  this.timeout(30000);
  let driver;

  async function saveScreenshot(driver, filename) {
    const image = await driver.takeScreenshot();
    await fs.writeFile(path.join(__dirname, filename), image, 'base64');
  }

  beforeEach(async function () {
    // Use chromedriver from local file
    const service = new chrome.ServiceBuilder('./chromedriver.exe').build();
    chrome.setDefaultService(service);

    driver = await new Builder().forBrowser('chrome').build();
  });

  afterEach(async function () {
    await driver.quit();
  });

  it('yesttt', async function () {
    await driver.get("https://theysaidso.com/");
    await driver.manage().window().setRect({ width: 1054, height: 800 });

    await saveScreenshot(driver, 'screenshot_01.png');

    await driver.executeScript("window.scrollTo(0,512)");
    await saveScreenshot(driver, 'screenshot_02.png');

    await driver.close();
  });
});
