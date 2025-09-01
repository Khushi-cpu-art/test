const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

describe('Selenium + Mochawesome embedded screenshots test', function () {
  this.timeout(30000);

  let driver;
  const attachments = [];

  before(async function () {
    // Create a unique temp directory for Chrome user data to avoid conflicts
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-user-data-'));

    // Configure Chrome options
    const options = new chrome.Options();
    options.addArguments(
      '--headless=new',           // Use new headless mode
      '--no-sandbox',             // Required for many CI environments
      '--disable-dev-shm-usage',  // Helps prevent resource issues in containers
      `--user-data-dir=${tmpDir}` // Unique user data dir to avoid session conflicts
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // Ensure screenshots directory exists
    const screenshotsDir = path.resolve(__dirname, 'mochawesome-report', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should open Google and take screenshots with embedded attachments', async function () {
    await driver.get('https://www.google.com');

    // Screenshot 1
    const screenshot1 = await driver.takeScreenshot();
    const filename1 = 'step_1.png';
    const filepath1 = path.resolve(__dirname, 'mochawesome-report', 'screenshots', filename1);
    fs.writeFileSync(filepath1, screenshot1, 'base64');
    attachments.push({
      name: 'Screenshot Step 1',
      type: 'image/png',
      path: `screenshots/${filename1}`,
    });

    // Search for "Mochawesome"
    const searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('Mochawesome');
    await searchBox.submit();

    // Wait a bit for results
    await driver.sleep(2000);

    // Screenshot 2
    const screenshot2 = await driver.takeScreenshot();
    const filename2 = 'step_2.png';
    const filepath2 = path.resolve(__dirname, 'mochawesome-report', 'screenshots', filename2);
    fs.writeFileSync(filepath2, screenshot2, 'base64');
    attachments.push({
      name: 'Screenshot Step 2',
      type: 'image/png',
      path: `screenshots/${filename2}`,
    });

    // Assert page title contains "Mochawesome"
    const title = await driver.getTitle();
    assert(title.toLowerCase().includes('mochawesome'));
  });

  afterEach(function () {
    if (attachments.length) {
      this.attachments = attachments;
    }
  });
});
