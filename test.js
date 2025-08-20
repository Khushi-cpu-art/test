const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Selenium Screenshot Test', function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should load page and take screenshot', async function () {
    await driver.get('https://theysaidso.com');

    const title = await driver.getTitle();
    assert.ok(title.includes('They Said So'), 'Page title does not include "They Said So"');

    // Take screenshot
    const screenshotBase64 = await driver.takeScreenshot();

    // Save screenshot to file (optional)
    const screenshotDir = path.resolve(__dirname, 'mochawesome-report');
    fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, 'screenshot_01.png');
    fs.writeFileSync(screenshotPath, screenshotBase64, 'base64');

    // Attach inline image to mochawesome report
    if (this.test && this.test.context) {
      this.test.context.attach = {
        title: 'Screenshot',
        value: `<img src="data:image/png;base64,${screenshotBase64}" width="600"/>`,
      };
    } else if (this.test) {
      this.test.context = {
        title: 'Screenshot',
        value: `<img src="data:image/png;base64,${screenshotBase64}" width="600"/>`,
      };
    }
  });
});
