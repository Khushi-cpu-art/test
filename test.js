const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver;

async function attachScreenshot(ctx) {
  const screenshotBase64 = await driver.takeScreenshot();
  ctx.attachments = ctx.attachments || [];
  ctx.attachments.push({
    name: ctx?.test?.title + ' - Screenshot',
    type: 'image/png',
    data: screenshotBase64,
    encoding: 'base64',
  });
  console.log(`Screenshot taken for: ${ctx?.test?.title}`);
}

describe('Selenium Test with Embedded Screenshots', function () {
  this.timeout(30000);

  before(async () => {
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

  after(async () => {
    if (driver) await driver.quit();
    console.log('Browser closed');
  });
});
