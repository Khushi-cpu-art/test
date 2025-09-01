const { execSync } = require('child_process');
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Utility: take screenshot for each step
async function takeStepScreenshot(stepName) {
  const screenshot = await global.driver.takeScreenshot();
  const dir = path.resolve('mochawesome-report/screenshots');
  const fileName = `${Date.now()}_${stepName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
  const filePath = path.join(dir, fileName);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, screenshot, 'base64');

  // Optional: Log path
  console.log(`📸 Screenshot taken: ${filePath}`);

  // Add attachment info (for mochawesome)
  global._stepScreenshots = global._stepScreenshots || [];
  global._stepScreenshots.push({
    name: stepName,
    path: `screenshots/${fileName}`,
    type: 'image/png'
  });
}

before(async function() {
  this.timeout(10000);

  try {
    execSync('pkill -f chrome');
    console.log('Killed existing Chrome processes.');
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {
    console.log('No existing Chrome processes found.');
  }

  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');

  global.driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  console.log('Chrome WebDriver started in headless mode.');
});

describe('Sample Selenium Test with Step Screenshots', function () {
  this.timeout(30000);

  it('should open a page, take step screenshots, and check title', async function () {
    const driver = global.driver;

    await driver.get('http://theysaidso.com/');
    await takeStepScreenshot('page_loaded');

    const title = await driver.getTitle();
    await takeStepScreenshot('title_fetched');

    console.log('Page title:', title);
    if (!title || title.length === 0) {
      throw new Error('Title is empty');
    }
  });
});

// Attach screenshots after each test (pass/fail)
afterEach(function () {
  if (global._stepScreenshots && global._stepScreenshots.length > 0) {
    this.attachments = global._stepScreenshots;
  }
  global._stepScreenshots = []; // reset for next test
});

after(async function () {
  if (global.driver) {
    await global.driver.quit();
    console.log('Chrome WebDriver quit.');
  }
});
