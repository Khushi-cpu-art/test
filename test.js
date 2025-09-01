const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Selenium + Mochawesome embedded screenshots test', function () {
  this.timeout(30000);

  let driver;
  // Attachments array used by mochawesome to embed files in report
  const attachments = [];

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();

    // Ensure screenshots dir exists
    const screenshotsDir = path.resolve(__dirname, 'mochawesome-report', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should open Google and take screenshots with embedded attachments', async function () {
    // Navigate to Google
    await driver.get('https://www.google.com');

    // Take first screenshot
    const screenshot1 = await driver.takeScreenshot();
    const filename1 = 'step_1.png';
    const filepath1 = path.resolve(__dirname, 'mochawesome-report', 'screenshots', filename1);
    fs.writeFileSync(filepath1, screenshot1, 'base64');

    // Add attachment for mochawesome report generator
    attachments.push({
      name: 'Screenshot Step 1',
      type: 'image/png',
      path: `screenshots/${filename1}`, // relative to mochawesome-report folder
    });

    // Search for "Mochawesome"
    const searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('Mochawesome');
    await searchBox.submit();

    // Wait for results
    await driver.sleep(2000);

    // Take second screenshot
    const screenshot2 = await driver.takeScreenshot();
    const filename2 = 'step_2.png';
    const filepath2 = path.resolve(__dirname, 'mochawesome-report', 'screenshots', filename2);
    fs.writeFileSync(filepath2, screenshot2, 'base64');

    attachments.push({
      name: 'Screenshot Step 2',
      type: 'image/png',
      path: `screenshots/${filename2}`,
    });

    // Simple assertion example (page title contains 'Mochawesome')
    const title = await driver.getTitle();
    assert(title.toLowerCase().includes('mochawesome'));
  });

  // Tell mochawesome about the attachments by attaching to the test context
  afterEach(function () {
    if (attachments.length) {
      this.attachments = attachments;
    }
  });
});
