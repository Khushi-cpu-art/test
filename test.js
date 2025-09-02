require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const addContext = require('mochawesome/addContext');

let driver;

before(async function () {
  this.timeout(20000);
  const options = new chrome.Options();
  options.addArguments(
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1920,1080'
  );
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
});

after(async function () {
  if (driver) {
    await driver.quit();
    console.log('✅ Chrome closed');
  }
});

function sanitizeName(title) {
  return title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
}

async function attachScreenshot(ctx) {
  const title = ctx?.test?.title || 'screenshot';
  const screenshot = await driver.takeScreenshot();
  const screenshotDir = path.resolve('mochawesome-report/screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });

  const fileName = sanitizeName(title);
  const filePath = path.join(screenshotDir, fileName);

  try {
    fs.writeFileSync(filePath, screenshot, 'base64');
    console.log(`📸 Screenshot saved: ${filePath}`);
  } catch (err) {
    console.error('❌ Error saving screenshot:', err);
  }

  if (ctx && ctx.test) {
    addContext(ctx, {
      title: 'Screenshot',
      value: `screenshots/${fileName}`
    });
  }
}

describe('Selenium + Mochawesome CI Demo', function () {
  this.timeout(30000);

  it('Step 1: Open homepage', async function () {
    await driver.get('https://example.com');
    await attachScreenshot(this);
  });

  it('Step 2: Take title screenshot', async function () {
    await attachScreenshot(this);
  });
});
