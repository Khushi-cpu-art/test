const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

let driver;

async function saveScreenshot(testContext) {
  const screenshotBase64 = await driver.takeScreenshot();
  const dir = path.join(__dirname, 'mochawesome-report', 'screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const fileName = testContext.test.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
  const filePath = path.join(dir, fileName);

  fs.writeFileSync(filePath, screenshotBase64, 'base64');
  
  // Add screenshot to Mochawesome context to embed inline
  testContext.test.context = testContext.test.context || [];
  testContext.test.context.push(`![Screenshot](./screenshots/${fileName})`);

  console.log(`Screenshot saved for test: ${testContext.test.title}`);
}

describe('Mochawesome Selenium Tests', function () {
  this.timeout(30000);

  before(async function () {
    const options = new chrome.Options();
    options.addArguments(
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,1024'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  it('Step 1: Load theysaidso.com', async function () {
    await driver.get('https://theysaidso.com');
    await saveScreenshot(this);
  });

  it('Step 2: Scroll down', async function () {
    await driver.executeScript('window.scrollBy(0, 300)');
    await new Promise(r => setTimeout(r, 1000));
    await saveScreenshot(this);
  });

  it('Step 3: Scroll more', async function () {
    await driver.executeScript('window.scrollBy(0, 300)');
    await new Promise(r => setTimeout(r, 1000));
    await saveScreenshot(this);
  });

  it('Step 4: Scroll to top', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 1000));
    await saveScreenshot(this);
  });

  it('Step 5: Verify title', async function () {
    const title = await driver.getTitle();
    console.log('Page title:', title);
    await saveScreenshot(this);
  });

  it('Step 6: Final screenshot', async function () {
    await saveScreenshot(this);
  });

  after(async function () {
    if (driver) await driver.quit();
  });
});
