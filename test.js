const { execSync } = require('child_process');
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

let driver;

function takeScreenshotFileName(title) {
  return title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
}

async function takeScreenshot(testContext) {
  const screenshot = await driver.takeScreenshot();
  const dir = path.resolve('mochawesome-report/screenshots');
  fs.mkdirSync(dir, { recursive: true });

  const fileName = takeScreenshotFileName(testContext.currentTest.title);
  const filePath = path.join(dir, fileName);

  fs.writeFileSync(filePath, screenshot, 'base64');

  testContext.attachments = [
    {
      name: 'Screenshot',
      type: 'image/png',
      path: `screenshots/${fileName}`
    }
  ];
}

before(async function () {
  this.timeout(20000);

  try {
    execSync('pkill -f chrome');
    console.log('✅ Killed existing Chrome processes.');
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {
    console.log('ℹ️ No existing Chrome processes found.');
  }

  const options = new chrome.Options();
  options.addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080');

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
});

describe('🧪 Selenium Step-by-Step Test with Screenshots', function () {
  this.timeout(30000);

  it('Step 1: Open website', async function () {
    await driver.get('http://theysaidso.com/');
    await takeScreenshot(this);
  });

  it('Step 2: Check page title', async function () {
    const title = await driver.getTitle();
    console.log('Page title:', title);
    await takeScreenshot(this);

    if (!title || title.length === 0) {
      throw new Error('Title is empty');
    }
  });

  // Add more steps here as needed, each with its own `it()` and `await takeScreenshot(this)`
});

after(async function () {
  if (driver) {
    await driver.quit();
  }
});
