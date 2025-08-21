const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const addContext = require('mochawesome/addContext');

describe('Selenium Test with Embedded Screenshots', function () {
  this.timeout(60000);
  let driver;

  async function saveScreenshot(driver) {
    const img = await driver.takeScreenshot();
    return `data:image/png;base64,${img}`;
  }

  before(async function () {
    let options = new chrome.Options()
      .addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should load the site and take screenshots for every step', async function () {
    await driver.get('https://theysaidso.com/');

    // Step 1: homepage screenshot
    let imgBase64 = await saveScreenshot(driver);
    addContext(this, {
      title: 'Homepage Screenshot',
      value: imgBase64
    });

    // Example: wait 2 seconds and screenshot again
    await driver.sleep(2000);
    imgBase64 = await saveScreenshot(driver);
    addContext(this, {
      title: 'After Wait Screenshot',
      value: imgBase64
    });

    // Final step screenshot
    imgBase64 = await saveScreenshot(driver);
    addContext(this, {
      title: 'Final Step Screenshot',
      value: imgBase64
    });
  });
});
