const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver;

// Attach screenshot as base64 embedded image to Mochawesome report
async function attachScreenshot(ctx) {
  const screenshotBase64 = await driver.takeScreenshot();
  ctx.attachments = ctx.attachments || [];
  ctx.attachments.push({
    name: ctx?.test?.title + ' - Screenshot',
    type: 'image/png',
    data: screenshotBase64,
    encoding: 'base64',
  });
}

describe('Selenium tests with embedded screenshots', function () {
  this.timeout(30000);

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

  it('Step 1: Open homepage', async function () {
    await driver.get('https://theysaidso.com');
    await attachScreenshot(this);
  });

  it('Step 2: Scroll down', async function () {
    await driver.executeScript('window.scrollBy(0, 600)');
    await new Promise(r => setTimeout(r, 500));
    await driver.executeScript('window.scrollBy(0, 800)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 3: Scroll to top', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 4: Check page title', async function () {
    const title = await driver.getTitle();
    console.log('Title:', title);
    await attachScreenshot(this);
  });

  it('Step 5: Scroll to footer', async function () {
    try {
      const footer = await driver.findElement(By.css('footer'));
      await driver.executeScript('arguments[0].scrollIntoView(true);', footer);
      await new Promise(r => setTimeout(r, 1000));
      await attachScreenshot(this);
    } catch (e) {
      console.log('Footer not found, skipping screenshot.');
    }
  });

  it('Step 6: Final snapshot', async function () {
    await attachScreenshot(this);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('✅ Chrome closed');
    }
  });
});
