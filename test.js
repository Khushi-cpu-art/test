const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');

describe('test', function () {
  this.timeout(30000);
  let driver;

  async function saveScreenshot(driver, filename) {
    const image = await driver.takeScreenshot();
    await fs.writeFile(path.join(__dirname, filename), image, 'base64');
  }

  beforeEach(async function () {
    // Provide the chromedriver path using chrome.Options
    const options = new chrome.Options();
    const service = new chrome.ServiceBuilder('./chromedriver.exe');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('test', async function () {
    await driver.get("https://theysaidso.com/");
    await driver.manage().window().setRect({ width: 1054, height: 800 });

    await saveScreenshot(driver, 'screenshot_01.png');

    await driver.executeScript("window.scrollTo(0,512)");
    await saveScreenshot(driver, 'screenshot_02.png');

    await driver.close();
  });
});
