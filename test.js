const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Selenium Screenshot Test', function() {
  let driver;

  // Increase timeout for setup and test
  this.timeout(30000);

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should load page and take screenshot', async function() {
    await driver.get('https://example.com');
    const title = await driver.getTitle();
    assert.ok(title.includes('Example'), 'Page title does not include "Example"');

    // Take screenshot as base64 string
    const screenshotBase64 = await driver.takeScreenshot();

    // Embed screenshot directly inside the Mochawesome HTML report
    this.test.context = {
      title: 'Screenshot',
      value: `<img src="data:image/png;base64,${screenshotBase64}" width="400"/>`
    };
  });
});
