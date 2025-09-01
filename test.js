const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

let driver;

async function attachScreenshot(ctx) {
  const screenshotBase64 = await driver.takeScreenshot();

  const screenshotDir = path.resolve(__dirname, 'mochawesome-report', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Sanitize test title to create a filename
  const fileName = ctx.test.title.replace(/[^a-z0-9\-]/gi, '_').toLowerCase() + '.png';
  const filePath = path.join(screenshotDir, fileName);

  // Write screenshot file
  fs.writeFileSync(filePath, screenshotBase64, 'base64');

  // Wait a bit to ensure file system writes finish
  await new Promise((r) => setTimeout(r, 200));

  // Attach screenshot in Mochawesome context (show inline in report)
  ctx.test.context = ctx.test.context || [];
  ctx.test.context.push({
    title: 'Screenshot',
    value: `![Screenshot](./screenshots/${fileName})`,
  });

  console.log(`📸 Screenshot saved: ${fileName}`);
}

describe('Selenium + Mochawesome Test', function () {
  this.timeout(40000);

  before(async function () {
    const options = new chrome.Options();
    options.addArguments(
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  it('Step 1: Open example.com and take screenshot', async function () {
    await driver.get('https://example.com');
    await attachScreenshot(this);
  });

  it('Step 2: Scroll down and take screenshot', async function () {
    await driver.executeScript('window.scrollBy(0, 500)');
    await new Promise((r) => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 3: Scroll further down and take screenshot', async function () {
    await driver.executeScript('window.scrollBy(0, 700)');
    await new Promise((r) => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 4: Scroll back up and take screenshot', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await new Promise((r) => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 5: Check page title and take screenshot', async function () {
    const title = await driver.getTitle();
    console.log('Page title:', title);
    await attachScreenshot(this);
  });

  it('Step 6: Final screenshot', async function () {
    await attachScreenshot(this);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('✅ Browser closed');
    }
  });
});
