const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

let driver;
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

let driver;

// Helper to save screenshots and embed in mochawesome report
async function attachScreenshot(ctx, stepName) {
  const screenshotDir = path.resolve('mochawesome-report/screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });

  const fileName = stepName.replace(/\s+/g, '_').toLowerCase() + '.png';
  const filePath = path.join(screenshotDir, fileName);

  const screenshot = await driver.takeScreenshot();
  fs.writeFileSync(filePath, screenshot, 'base64');

  // Embed image in HTML report
  ctx.test.context = ctx.test.context || [];
  ctx.test.context.push(`![${stepName}](./screenshots/${fileName})`);
}

describe('📸 Selenium Multi-Step Test with Multiple Screenshots', function () {
  this.timeout(30000);

  before(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--no-sandbox', '--window-size=1280,800');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  it('Step 1: Open homepage', async function () {
    await driver.get('https://theysaidso.com');
    await attachScreenshot(this, 'Step 1 - Open homepage');
  });

  it('Step 2: Scroll down', async function () {
    await driver.executeScript('window.scrollBy(0, 600)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this, 'Step 2 - Scroll down');
  });

  it('Step 3: Scroll up', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this, 'Step 3 - Scroll up');
  });

  it('Step 4: Get title', async function () {
    const title = await driver.getTitle();
    console.log('Page Title:', title);
    await attachScreenshot(this, 'Step 4 - Get title');
  });

  it('Step 5: Hover over footer', async function () {
    try {
      const footer = await driver.findElement(By.css('footer'));
      await driver.executeScript('arguments[0].scrollIntoView(true);', footer);
      await new Promise(r => setTimeout(r, 1000));
      await attachScreenshot(this, 'Step 5 - Hover over footer');
    } catch (err) {
      console.log('Footer not found. Skipping screenshot.');
    }
  });

  it('Step 6: Final screenshot', async function () {
    await attachScreenshot(this, 'Step 6 - Final screenshot');
  });

  after(async () => {
    if (driver) {
      await driver.quit();
      console.log('✅ Browser closed');
    }
  });
});

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
