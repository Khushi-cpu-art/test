const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const addContext = require('mochawesome/addContext');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, name) {
  const img = await driver.takeScreenshot();
  const filePath = path.join(screenshotDir, `${name}.png`);
  fs.writeFileSync(filePath, img, 'base64');
  console.log(`Screenshot saved: ${filePath}`);
  return `data:image/png;base64,${img}`;
}

describe('Selenium Test with Step-wise Screenshots', function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    let options = new chrome.Options()
      .addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should interact with page and take screenshots after each step', async function () {
    // 1. Load page
    await driver.get('https://theysaidso.com/');
    let imgBase64 = await saveScreenshot(driver, 'step_1_page_loaded');
    addContext(this, { title: 'Step 1: Page Loaded', value: imgBase64 });

    // 2. Wait for body element as generic page load check
    await driver.wait(until.elementLocated(By.css('body')), 10000);
    imgBase64 = await saveScreenshot(driver, 'step_2_body_loaded');
    addContext(this, { title: 'Step 2: Body Element Loaded', value: imgBase64 });

    // 3. Example: Wait for a specific element if exists, else skip
    try {
      const quoteSelector = '.qod-quote'; // Adjust if needed after inspecting the page
      const quoteElem = await driver.wait(until.elementLocated(By.css(quoteSelector)), 5000);
      imgBase64 = await saveScreenshot(driver, 'step_3_quote_element');
      addContext(this, { title: 'Step 3: Quote Element Located', value: imgBase64 });

      // You can add interactions here, like clicking or extracting text

    } catch (err) {
      console.warn('Quote element not found within 5 seconds, skipping step 3');
    }
  });
});
