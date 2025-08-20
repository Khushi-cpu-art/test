const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
require('chromedriver');  // Load chromedriver from node_modules

// Set chromedriver service
const service = new chrome.ServiceBuilder(require('chromedriver').path).build();
chrome.setDefaultService(service);

describe('Selenium Screenshot Test', function () {
  this.timeout(60000); // 60 seconds timeout
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should load page and take screenshots', async function () {
    await driver.get('https://theysaidso.com/');

    // Take screenshot 1
    let screenshot1 = await driver.takeScreenshot();
    fs.writeFileSync(path.join(__dirname, 'screenshot_01.png'), screenshot1, 'base64');

    // Scroll down and take screenshot 2
    await driver.executeScript('window.scrollTo(0, 500);');
    let screenshot2 = await driver.takeScreenshot();
    fs.writeFileSync(path.join(__dirname, 'screenshot_02.png'), screenshot2, 'base64');
  });
});
