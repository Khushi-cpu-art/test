const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

let driver;

async function attachScreenshot(ctx) {
  const screenshotBase64 = await driver.takeScreenshot();
  const screenshotDir = path.resolve(__dirname, 'mochawesome-report', 'screenshots');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Clean test title for filename
  const fileName = ctx.test.title.replace(/[^a-z0-9\-]/gi, '_').toLowerCase() + '.png';
  const filePath = path.join(screenshotDir, fileName);

  fs.writeFileSync(filePath, screenshotBase64, 'base64');

  // Attach screenshot markdown for Mochawesome HTML report embedding
  ctx.test.context = ctx.test.context || [];
  ctx.test.context.push(`![Screenshot](./screenshots/${fileName})`);

  console.log(`Screenshot saved: ${filePath}`);
}

describe('Selenium + Mochawesome Test with Multiple Screenshots', function () {
  this.timeout(60000); // Increase timeout as there are many steps

  before(async function () {
    const serviceBuilder = new chrome.ServiceBuilder(chromedriver.path);
    const options = new chrome.Options();
    options.addArguments(
      '--headless=new',
      '--window-size=1920,1080',
      '--no-sandbox',
      '--disable-dev-shm-usage'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(serviceBuilder)
      .setChromeOptions(options)
      .build();
  });

  it('Step 1: Open the homepage', async function () {
    await driver.get('https://theysaidso.com');
    const title = await driver.getTitle();
    assert.ok(title.length > 0, 'Title should not be empty');
    await attachScreenshot(this);
  });

  it('Step 2: Scroll down 500px', async function () {
    await driver.executeScript('window.scrollBy(0, 500)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 3: Scroll down further 700px', async function () {
    await driver.executeScript('window.scrollBy(0, 700)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 4: Scroll back to top', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 5: Check for footer and scroll to it', async function () {
    try {
      const footer = await driver.findElement({ css: 'footer' });
      await driver.executeScript('arguments[0].scrollIntoView(true);', footer);
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.log('Footer not found, skipping scroll');
    }
    await attachScreenshot(this);
  });

  it('Step 6: Verify page title content', async function () {
    const title = await driver.getTitle();
    assert.ok(title.toLowerCase().includes('said'), 'Title contains "said"');
    await attachScreenshot(this);
  });

  it('Step 7: Final snapshot', async function () {
    await attachScreenshot(this);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('Browser closed');
    }
  });
});
