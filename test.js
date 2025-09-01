const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const { ServiceBuilder } = require('selenium-webdriver/chrome');

let driver;

async function attachScreenshot(ctx) {
  const screenshotBase64 = await driver.takeScreenshot();
  ctx.attachments = ctx.attachments || [];
  ctx.attachments.push({
    name: `${ctx.test.title} - Screenshot`,
    type: 'image/png',
    data: screenshotBase64,
    encoding: 'base64',
  });
  console.log(`Screenshot taken for: ${ctx.test.title}`);
}

describe('Selenium + Mochawesome Test', function () {
  this.timeout(30000);

  before(async function () {
    const service = new ServiceBuilder(chromedriver.path);
    const options = new chrome.Options()
      .headless()
      .windowSize({ width: 1920, height: 1080 })
      .addArguments('--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('Browser closed');
    }
  });

  it('Open example.com and take screenshot', async function () {
    await driver.get('https://theysaidso.com');
    await attachScreenshot(this);
  });

  it('Scroll down and take screenshot', async function () {
    await driver.executeScript('window.scrollBy(0, 500)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Check page title and take screenshot', async function () {
    const title = await driver.getTitle();
    console.log('Page title:', title);
    await attachScreenshot(this);
  });
});
