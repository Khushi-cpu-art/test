const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

let driver;

async function attachScreenshot(ctx) {
  const base64 = await driver.takeScreenshot();
  ctx.attachments = ctx.attachments || [];
  ctx.attachments.push({
    name: ctx.test.title + ' - Screenshot',
    type: 'image/png',
    data: base64,
    encoding: 'base64',
  });
  console.log(`Screenshot attached for: ${ctx.test.title}`);
}

describe('Selenium + Mochawesome Tests', function () {
  this.timeout(30000);

  before(async () => {
    const serviceBuilder = new chrome.ServiceBuilder(chromedriver.path);
    const options = new chrome.Options().addArguments(
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(serviceBuilder)
      .build();
  });

  it('Open example.com and screenshot', async function () {
    await driver.get('https://example.com');
    await attachScreenshot(this);
  });

  it('Scroll down and screenshot', async function () {
    await driver.executeScript('window.scrollBy(0, 300)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Get page title and screenshot', async function () {
    const title = await driver.getTitle();
    console.log('Page title:', title);
    await attachScreenshot(this);
  });

  after(async () => {
    if (driver) await driver.quit();
    console.log('Browser closed');
  });
});
