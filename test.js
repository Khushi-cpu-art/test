const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');

const screenshotDir = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, name) {
  const img = await driver.takeScreenshot();
  const filePath = path.join(screenshotDir, `${name}.png`);
  fs.writeFileSync(filePath, img, 'base64');
  console.log(`Screenshot saved: ${filePath}`);
  return `${name}.png`; // return filename for embedding
}

describe('Selenium Steps with Screenshots', function () {
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

  it('should perform steps and take screenshots after each', async function () {
    // Step 1: Open the page
    await driver.get('https://theysaidso.com/');
    let screenshot = await saveScreenshot(driver, 'step_1_page_loaded');
    this.test.context(`![Step 1 - Page Loaded](./mochawesome-report/${screenshot})`);

    // Step 2: Click QShows link
    await driver.findElement(By.linkText("QShows»")).click();
    screenshot = await saveScreenshot(driver, 'step_2_qshows_clicked');
    this.test.context(`![Step 2 - QShows Clicked](./mochawesome-report/${screenshot})`);

    // Step 3: Wait a bit for page load and click Home
    await driver.sleep(2000);
    await driver.findElement(By.linkText("Home")).click();
    screenshot = await saveScreenshot(driver, 'step_3_home_clicked');
    this.test.context(`![Step 3 - Home Clicked](./mochawesome-report/${screenshot})`);

    // Step 4: Scroll to a few positions and take screenshot after last scroll
    await driver.executeScript("window.scrollTo(0, 300)");
    await driver.sleep(500);
    await driver.executeScript("window.scrollTo(0, 1160)");
    await driver.sleep(500);
    await driver.executeScript("window.scrollTo(0, 1700)");
    await driver.sleep(500);
    screenshot = await saveScreenshot(driver, 'step_4_scrolled');
    this.test.context(`![Step 4 - Scrolled](./mochawesome-report/${screenshot})`);

    // Step 5: Click API Details
    await driver.findElement(By.linkText("API Details »")).click();
    await driver.sleep(2000);
    screenshot = await saveScreenshot(driver, 'step_5_api_details_clicked');
    this.test.context(`![Step 5 - API Details Clicked](./mochawesome-report/${screenshot})`);

    // Step 6: Click the link "https://quotes.rest"
    await driver.executeScript("window.scrollTo(0, 490)");
    await driver.sleep(500);
    await driver.findElement(By.linkText("https://quotes.rest")).click();
    screenshot = await saveScreenshot(driver, 'step_6_quotes_rest_clicked');
    this.test.context(`![Step 6 - Quotes Rest Clicked](./mochawesome-report/${screenshot})`);
  });
});
