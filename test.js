const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
require('chromedriver');

describe('Selenium Screenshot Test', function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--no-sandbox');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get('https://theysaidso.com/');

    // Wait and click Accept on cookie popup
    try {
      await driver.wait(until.elementLocated(By.css('button#cookieConsentAccept')), 5000);
      const acceptBtn = await driver.findElement(By.css('button#cookieConsentAccept'));
      await acceptBtn.click();
      await driver.sleep(1000); // wait for popup to close
    } catch (e) {
      console.log('Cookie popup not found or already accepted.');
    }
  });

  it('Should load page and take screenshot without popup', async function () {
    const screenshot = await driver.takeScreenshot();
    const screenshotPath = path.resolve(__dirname, 'mochawesome-report', 'screenshot.png');
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    console.log(`Screenshot saved to ${screenshotPath}`);

    this.test.context = `data:image/png;base64,${screenshot}`;
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
