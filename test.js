const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Selenium Screenshot Test', function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    // Ensure screenshots directory exists
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('Should load page and take screenshots', async function () {
    await driver.get('https://theysaidso.com/');

    // Screenshot 1
    let screenshot1 = await driver.takeScreenshot();
    fs.writeFileSync(path.join('screenshots', 'screenshot_01.png'), screenshot1, 'base64');

    // Scroll down a bit
    await driver.executeScript('window.scrollTo(0, 300);');

    // Screenshot 2
    let screenshot2 = await driver.takeScreenshot();
    fs.writeFileSync(path.join('screenshots', 'screenshot_02.png'), screenshot2, 'base64');

    // Verify page title contains expected text
    const title = await driver.getTitle();
    assert.ok(title.includes('They Said So'));
  });
});
