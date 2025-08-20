const { Builder } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Selenium Screenshot Test', function () {
  this.timeout(30000); // increase timeout to 30 seconds

  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should load page and take screenshot', async function () {
    await driver.get('https://example.com');

    const screenshotDir = path.resolve(__dirname, 'mochawesome-report');
    const screenshotFile = 'screenshot_01.png';
    const screenshotPath = path.join(screenshotDir, screenshotFile);

    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, screenshot, 'base64');

    // Embed screenshot in mochawesome report
    this.test.context = {
      title: 'Screenshot',
      value: `<img src="${screenshotFile}" width="400"/>`
    };

    // Basic assert to confirm page loaded (optional)
    const title = await driver.getTitle();
    assert.ok(title.includes('Example Domain'));
  });
});
