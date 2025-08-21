const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const os = require('os');
const path = require('path');
const addContext = require('mochawesome/addContext');

const screenshotDir = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, name) {
  const img = await driver.takeScreenshot();
  const p = path.join(screenshotDir, `${name}.png`);
  fs.writeFileSync(p, img, 'base64');
  console.log(`Screenshot saved: ${p}`);
  return p;  // return the path for convenience
}

describe('Selenium Test with Dynamic Profile', function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    const tempDir = path.join(os.tmpdir(), `chrome_profile_${Date.now()}`);
    let options = new chrome.Options()
      .addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage')
      .addArguments(`--user-data-dir=${tempDir}`);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should load the site and take screenshots for every step', async function () {
    await driver.get('https://theysaidso.com/');
    let screenshotPath = await saveScreenshot(driver, 'homepage');
    addContext(this, path.resolve(screenshotPath));

    // Example additional step: click a button (modify selector as needed)
    // await driver.findElement(By.css('button.some-class')).click();

    // Wait for an element or just wait some time for demo
    await driver.sleep(2000);

    screenshotPath = await saveScreenshot(driver, 'after-wait');
    addContext(this, path.resolve(screenshotPath));

    // Another step example (modify to your actual test steps)
    // await driver.findElement(By.linkText('Some Link')).click();
    // await driver.sleep(1000);

    screenshotPath = await saveScreenshot(driver, 'final-step');
    addContext(this, path.resolve(screenshotPath));
  });
});
