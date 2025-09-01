const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

let driver;

async function attachScreenshot(ctx) {
  try {
    const base64 = await driver.takeScreenshot();
    ctx.attachments = ctx.attachments || [];
    ctx.attachments.push({
      name: ctx.test.title + ' - Screenshot',
      type: 'image/png',
      data: base64,
      encoding: 'base64',
    });
    console.log(`Screenshot attached: ${ctx.test.title}`);
  } catch (e) {
    console.error('Error taking screenshot:', e);
  }
}

describe('Selenium + Mochawesome with manual ChromeDriver', function () {
  this.timeout(30000);

  before(async () => {
    const service = new chrome.ServiceBuilder(chromedriver.path).build();

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
      .setChromeService(service)  // Pass the service here instead of setDefaultService
      .build();
  });

  it('Navigate to example.com and screenshot', async function () {
    await driver.get('https://example.com');
    await attachScreenshot(this);
  });

  it('Scroll and screenshot', async function () {
    await driver.executeScript('window.scrollBy(0, 300)');
    await new Promise((r) => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Get title and screenshot', async function () {
    const title = await driver.getTitle();
    console.log('Title:', title);
    await attachScreenshot(this);
  });

  after(async () => {
    if (driver) await driver.quit();
    console.log('Browser closed');
  });
});
