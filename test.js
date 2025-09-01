const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const addContext = require('mochawesome/addContext');

let driver;

async function attachScreenshot(ctx) {
  const screenshot = await driver.takeScreenshot();
  const dir = path.resolve('mochawesome-report', 'screenshots');
  fs.mkdirSync(dir, { recursive: true });

  const fileName = (ctx.test.title || 'screenshot').replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, screenshot, 'base64');

  // Attach to report
  addContext(ctx, {
    title: 'Screenshot',
    value: `./screenshots/${fileName}`
  });
}

describe('🔍 Selenium Test - 10 Distinct Steps with Screenshots', function () {
  this.timeout(60000);

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800');

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('Step 1: Load homepage', async function () {
    await driver.get('https://theysaidso.com');
    await attachScreenshot(this);
  });

  it('Step 2: Scroll 300px', async function () {
    await driver.executeScript('window.scrollBy(0, 300)');
    await attachScreenshot(this);
  });

  it('Step 3: Scroll another 500px', async function () {
    await driver.executeScript('window.scrollBy(0, 500)');
    await attachScreenshot(this);
  });

  it('Step 4: Scroll to top', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await attachScreenshot(this);
  });

  it('Step 5: Resize window', async function () {
    await driver.manage().window().setRect({ width: 1024, height: 600 });
    await attachScreenshot(this);
  });

  it('Step 6: Change viewport again', async function () {
    await driver.manage().window().setRect({ width: 800, height: 1000 });
    await attachScreenshot(this);
  });

  it('Step 7: Scroll to bottom', async function () {
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    await attachScreenshot(this);
  });

  it('Step 8: Scroll back up slightly', async function () {
    await driver.executeScript('window.scrollBy(0, -200)');
    await attachScreenshot(this);
  });

  it('Step 9: Capture title', async function () {
    const title = await driver.getTitle();
    console.log('Page Title:', title);
    await attachScreenshot(this);
  });

  it('Step 10: Final snapshot', async function () {
    await attachScreenshot(this);
  });
});
