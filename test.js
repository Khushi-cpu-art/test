const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

let driver;

// Attach screenshot to the test context (mochawesome will embed it)
async function attachScreenshot(ctx) {
  const screenshot = await driver.takeScreenshot();
  ctx.attachments = ctx.attachments || [];
  ctx.attachments.push({
    name: `${ctx.test.title} - Screenshot`,
    type: 'image/png',
    data: screenshot,
    encoding: 'base64',
  });
  console.log(`📸 Screenshot captured for: ${ctx.test.title}`);
}

describe('📷 Selenium Multi-Step Test with Multiple Screenshots', function () {
  this.timeout(30000); // Increase timeout for slow CI runs

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
    await new Promise(r => setTimeout(r, 800));
    await attachScreenshot(this);
  });

  it('Step 3: Scroll up', async function () {
    await driver.executeScript('window.scrollBy(0, -300)');
    await new Promise(r => setTimeout(r, 800));
    await attachScreenshot(this);
  });

  it('Step 4: Get title', async function () {
    const title = await driver.getTitle();
    console.log('Page title:', title);
    await attachScreenshot(this);
  });

  it('Step 5: Hover over footer (if exists)', async function () {
    try {
      const footer = await driver.findElement(By.css('footer'));
      await driver.executeScript('arguments[0].scrollIntoView(true);', footer);
      await new Promise(r => setTimeout(r, 1000));
      await attachScreenshot(this);
    } catch (err) {
      console.log('⚠️ Footer not found. Skipping this step.');
    }
  });

  it('Step 6: Final screenshot', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 500));
    await attachScreenshot(this);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('✅ Browser closed');
    }
  });
});
