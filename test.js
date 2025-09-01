const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

let driver;

// Util: Save screenshot & attach to mochawesome context
async function saveScreenshot(ctx) {
  const screenshot = await driver.takeScreenshot();

  const dir = path.join(__dirname, 'mochawesome-report', 'screenshots');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileName = ctx.test.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, screenshot, 'base64');

  // Attach image as markdown to mochawesome context
  ctx.test.context = ctx.test.context || [];
  ctx.test.context.push(`![Screenshot](./screenshots/${fileName})`);
  console.log(`📸 Saved screenshot: ${fileName}`);
}

describe('🧪 Selenium + Mochawesome Test with Multiple Screenshots', function () {
  this.timeout(30000);

  before(async function () {
    const options = new chrome.Options().addArguments(
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

  it('Step 1: Open homepage', async function () {
    await driver.get('https://example.com');
    await saveScreenshot(this);
  });

  it('Step 2: Scroll down slightly', async function () {
    await driver.executeScript('window.scrollBy(0, 300)');
    await driver.sleep(1000);
    await saveScreenshot(this);
  });

  it('Step 3: Scroll more', async function () {
    await driver.executeScript('window.scrollBy(0, 600)');
    await driver.sleep(1000);
    await saveScreenshot(this);
  });

  it('Step 4: Scroll to bottom', async function () {
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    await driver.sleep(1000);
    await saveScreenshot(this);
  });

  it('Step 5: Scroll back to top', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await driver.sleep(1000);
    await saveScreenshot(this);
  });

  it('Step 6: Get and log page title', async function () {
    const title = await driver.getTitle();
    console.log('Page title is:', title);
    await saveScreenshot(this);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('✅ Browser closed');
    }
  });
});
