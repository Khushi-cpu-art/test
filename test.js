const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver;

async function attachScreenshot(ctx) {
  try {
    const screenshotBase64 = await driver.takeScreenshot();

    // Ensure ctx.attachments exists
    ctx.attachments = ctx.attachments || [];

    // Push screenshot data to attachments for Mochawesome
    ctx.attachments.push({
      name: `${ctx.test.title} - Screenshot`,
      type: 'image/png',
      data: screenshotBase64,
      encoding: 'base64',
    });

    console.log(`✅ Screenshot taken for: ${ctx.test.title}`);
  } catch (err) {
    console.error('❌ Error taking screenshot:', err);
  }
}

describe('Selenium Test with Embedded Screenshots', function () {
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

    console.log('✅ Chrome WebDriver started');
  });

  it('Open theysaidso.com and take screenshot', async function () {
    await driver.get('https://theysaidso.com');
    console.log('✅ Loaded theysaidso.com');
    await attachScreenshot(this);
  });

  it('Scroll down the page and take screenshot', async function () {
    await driver.executeScript('window.scrollBy(0, 500)');
    await new Promise(r => setTimeout(r, 1000));
    console.log('✅ Scrolled down by 500px');
    await attachScreenshot(this);
  });

  it('Check page title and take screenshot', async function () {
    const title = await driver.getTitle();
    console.log('✅ Page title:', title);
    await attachScreenshot(this);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('✅ Chrome WebDriver closed');
    }
  });
});
