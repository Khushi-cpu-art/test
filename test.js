const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const addContext = require('mochawesome/addContext');

const screenshotDir = path.join(__dirname, 'mochawesome-report', 'screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, name) {
  const image = await driver.takeScreenshot();
  const filePath = path.join(screenshotDir, `${name}.png`);
  fs.writeFileSync(filePath, image, 'base64');
  return filePath;
}

describe('Selenium Test with Embedded Screenshots in Mochawesome Report', function() {
  this.timeout(60000);
  let driver;

  before(async function() {
    const options = new chrome.Options()
      .addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function() {
    if (driver) await driver.quit();
  });

  it('should load the homepage and take screenshots at each step', async function() {
    await driver.get('https://theysaidso.com/');
    const homepageScreenshot = await saveScreenshot(driver, 'homepage');
    addContext(this, { title: 'Homepage Screenshot', value: homepageScreenshot });

    // Example interaction: click "API" link
    const apiLink = await driver.findElement(By.partialLinkText('API'));
    await apiLink.click();
    const apiScreenshot = await saveScreenshot(driver, 'api_page');
    addContext(this, { title: 'API Page Screenshot', value: apiScreenshot });

    // You can add more steps here with screenshots and addContext calls
  });
});
