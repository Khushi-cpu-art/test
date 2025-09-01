const { execSync } = require('child_process');
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// 📸 Utility to take step-by-step screenshots
async function takeStepScreenshot(stepName) {
  const screenshot = await global.driver.takeScreenshot();
  const dir = path.resolve('mochawesome-report/screenshots');
  const fileName = `${Date.now()}_${stepName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
  const filePath = path.join(dir, fileName);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, screenshot, 'base64');

  // Attach to mochawesome
  global._stepScreenshots = global._stepScreenshots || [];
  global._stepScreenshots.push({
    name: stepName,
    type: 'image/png',
    path: `screenshots/${fileName}`,
  });

  console.log(`📸 Screenshot taken: ${fileName}`);
}

before(function () {
  this.timeout(20000); // Increase timeout for setup

  return (async () => {
    try {
      execSync('pkill -f chrome');
      console.log('✅ Killed existing Chrome processes.');
      await new Promise((r) => setTimeout(r, 2000));
    } catch (e) {
      console.log('ℹ️ No existing Chrome processes found.');
    }

    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');

    console.log('🚀 Starting Chrome WebDriver...');
    global.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    console.log('✅ Chrome WebDriver started in headless mode.');
  })();
});

describe('🔍 Sample Selenium Test with Step Screenshots', function () {
  this.timeout(30000);

  it('should open a page and check the title', async function () {
    const driver = global.driver;

    await driver.get('http://theysaidso.com/');
    await takeStepScreenshot('01_page_loaded');

    const title = await driver.getTitle();
    await takeStepScreenshot('02_title_fetched');

    console.log('📄 Page title:', title);

    if (!title || title.length === 0) {
      throw new Error('❌ Title is empty');
    }
  });
});

afterEach(function () {
  if (global._stepScreenshots && global._stepScreenshots.length > 0) {
    this.attachments = global._stepScreenshots;
  }
  global._stepScreenshots = []; // reset for next test
});

after(async function () {
  if (global.driver) {
    await global.driver.quit();
    console.log('🛑 Chrome WebDriver quit.');
  }
});
