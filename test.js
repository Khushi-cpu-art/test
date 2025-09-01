const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const fs = require('fs');
const path = require('path');

let driver;

async function attachScreenshot(ctx) {
  const screenshotBase64 = await driver.takeScreenshot();
  const screenshotDir = path.resolve(__dirname, 'mochawesome-report', 'screenshots');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const fileName = ctx?.test?.title.replace(/[^a-z0-9\-]/gi, '_').toLowerCase() + '.png';
  const filePath = path.join(screenshotDir, fileName);

  fs.writeFileSync(filePath, screenshotBase64, 'base64');

  // Attach screenshot path for Mochawesome report
  ctx.test.context = ctx.test.context || [];
  ctx.test.context.push(`![Screenshot](./screenshots/${fileName})`);

  console.log(`Screenshot saved: ${filePath}`);
}

describe('Selenium + Mochawesome Test', function () {
  this.timeout(30000);

  before(async function () {
    const serviceBuilder = new chrome.ServiceBuilder(chromedriver.path);
    const options = new chrome.Options();
    options.addArguments(
      '--headless=new',           // Chrome headless mode
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

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('Browser closed');
    }
  });
});
