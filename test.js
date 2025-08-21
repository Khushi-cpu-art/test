const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const os = require('os');
const path = require('path');
const addContext = require('mochawesome/addContext');

const screenshotDir = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, name) {
  const img = await driver.takeScreenshot();
  const filePath = path.join(screenshotDir, `${name}.png`);
  fs.writeFileSync(filePath, img, 'base64');
  console.log(`Screenshot saved: ${filePath}`);
  return `${name}.png`;
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
    // Step 1: Open the homepage
    await driver.get('https://theysaidso.com/');
    let screenshot = await saveScreenshot(driver, 'step_1_homepage');
    addContext(this, `./mochawesome-report/${screenshot}`);

    // Step 2: Resize window
    await driver.manage().window().setRect({ width: 1074, height: 800 });
    screenshot = await saveScreenshot(driver, 'step_2_window_resized');
    addContext(this, `./mochawesome-report/${screenshot}`);

    // Step 3: Click "QShows»" link
    await driver.findElement(By.linkText("QShows»")).click();
    await driver.sleep(1000);
    screenshot = await saveScreenshot(driver, 'step_3_qshows_clicked');
    addContext(this, `./mochawesome-report/${screenshot}`);

    // Step 4: Click "Home" link
    await driver.findElement(By.linkText("Home")).click();
    await driver.sleep(1000);
    screenshot = await saveScreenshot(driver, 'step_4_home_clicked');
    addContext(this, `./mochawesome-report/${screenshot}`);

    // Step 5: Scroll to various positions with small waits
    await driver.executeScript("window.scrollTo(0,290)");
    await driver.sleep(500);
    screenshot = await saveScreenshot(driver, 'step_5_scroll_290');
    addContext(this, `./mochawesome-report/${screenshot}`);

    await driver.executeScript("window.scrollTo(0,1160)");
    await driver.sleep(500);
    screenshot = await saveScreenshot(driver, 'step_6_scroll_1160');
    addContext(this, `./mochawesome-report/${screenshot}`);

    await driver.executeScript("window.scrollTo(0,1699)");
    await driver.sleep(500);
    screenshot = await saveScreenshot(driver, 'step_7_scroll_1699');
    addContext(this, `./mochawesome-report/${screenshot}`);

    await driver.executeScript("window.scrollTo(0,2854)");
    await driver.sleep(500);
    screenshot = await saveScreenshot(driver, 'step_8_scroll_2854');
    addContext(this, `./mochawesome-report/${screenshot}`);

    await driver.executeScript("window.scrollTo(0,3139)");
    await driver.sleep(500);
    screenshot = await saveScreenshot(driver, 'step_9_scroll_3139');
    addContext(this, `./mochawesome-report/${screenshot}`);

    // Step 6: Click "API Details »" link
    await driver.findElement(By.linkText("API Details »")).click();
    await driver.sleep(1000);
    screenshot = await saveScreenshot(driver, 'step_10_api_details_clicked');
    addContext(this, `./mochawesome-report/${screenshot}`);

    // Step 7: Scroll down a bit on API page
    await driver.executeScript("window.scrollTo(0,490)");
    await driver.sleep(500);
    screenshot = await saveScreenshot(driver, 'step_11_scroll_api');
    addContext(this, `./mochawesome-report/${screenshot}`);

    // Step 8: Click the "https://quotes.rest" link
    await driver.findElement(By.linkText("https://quotes.rest")).click();
    await driver.sleep(1000);
    screenshot = await saveScreenshot(driver, 'step_12_quotes_rest_clicked');
    addContext(this, `./mochawesome-report/${screenshot}`);
  });
});
