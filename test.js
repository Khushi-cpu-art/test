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
  const testTitle = testContext?.test?.title || 'unnamed_test';
  const screenshot = await driver.takeScreenshot();

  const dir = path.resolve('mochawesome-report/screenshots');
  fs.mkdirSync(dir, { recursive: true });

  const fileName = takeScreenshotFileName(testTitle);
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

describe('🧪 Selenium Multi-Step Test with Multiple Screenshots', function () {
  this.timeout(30000);

  it('Step 1: Open homepage', async function () {
    await driver.get('https://theysaidso.com');
    await takeScreenshot(this);
  });

  it('Step 2: Scroll down', async function () {
    await driver.executeScript("window.scrollBy(0, 500)");
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshot(this);
  });

  it('Step 3: Scroll up', async function () {
    await driver.executeScript("window.scrollTo(0, 0)");
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshot(this);
  });

  it('Step 4: Get title', async function () {
    const title = await driver.getTitle();
    console.log('Title:', title);
    await takeScreenshot(this);
  });

  it('Step 5: Hover over footer', async function () {
    const footer = await driver.findElement(By.css('footer'));
    await driver.executeScript("arguments[0].scrollIntoView(true);", footer);
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshot(this);
  });

  it('Step 6: Final screenshot', async function () {
    await takeScreenshot(this);
  });
});

after(async function () {
  if (driver) {
    await driver.quit();
  }
});
