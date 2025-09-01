const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

let driver;

async function attachScreenshot(ctx) {
  const screenshotBase64 = await driver.takeScreenshot();
  const screenshotDir = path.resolve('mochawesome-report', 'screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });

  const fileName = ctx.test.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
  const filePath = path.join(screenshotDir, fileName);

  fs.writeFileSync(filePath, screenshotBase64, 'base64');
  await new Promise(r => setTimeout(r, 200));

  ctx.test.context = ctx.test.context || [];
  ctx.test.context.push({
    title: 'Screenshot',
    value: `![${ctx.test.title}](./screenshots/${fileName})`
  });
  console.log(`Saved screenshot: ${fileName}`);
}

describe('Selenium + Mochawesome Multi-Step Test', function () {
  this.timeout(60000);

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  const steps = [
    { action: async () => await driver.get('https://example.com'), name: 'Open homepage' },
    { action: async () => await driver.executeScript('window.scrollBy(0, 300)'), name: 'Scroll down a bit' },
    { action: async () => await driver.executeScript('window.scrollBy(0, 600)'), name: 'Scroll down more' },
    { action: async () => await driver.executeScript('window.scrollTo(0, 0)'), name: 'Scroll to top' },
    { action: async () => { const t = await driver.getTitle(); console.log('Title:', t); }, name: 'Capture title' },
    { action: async () => await driver.findElement(By.tagName('h1')), name: 'Find h1 tag if present' }
  ];

  steps.forEach((step, index) => {
    it(`Step ${index + 1}: ${step.name}`, async function () {
      await step.action();
      await attachScreenshot(this);
    });
  });

  after(async function () {
    if (driver) await driver.quit();
    console.log('Browser closed');
  });
});
