const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const addContext = require('mochawesome/addContext');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, stepName) {
  const img = await driver.takeScreenshot();
  const filePath = path.join(screenshotDir, `${stepName}.png`);
  fs.writeFileSync(filePath, img, 'base64');
  console.log(`Screenshot saved: ${filePath}`);
  return `data:image/png;base64,${img}`;
}

describe('Selenium Steps with Screenshots', function () {
  this.timeout(60000);
  let driver;

  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('should perform steps and take screenshots after each', async function () {
    await driver.get("https://theysaidso.com/");
    let img = await saveScreenshot(driver, 'step_1_page_loaded');
    addContext(this, { title: 'Step 1: Page Loaded', value: img });

    await driver.manage().window().setRect({ width: 1074, height: 800 });
    img = await saveScreenshot(driver, 'step_2_window_resized');
    addContext(this, { title: 'Step 2: Window Resized', value: img });

    await driver.findElement(By.linkText("QShows»")).click();
    img = await saveScreenshot(driver, 'step_3_clicked_QShows');
    addContext(this, { title: 'Step 3: Clicked QShows»', value: img });

    await driver.sleep(2000);
    img = await saveScreenshot(driver, 'step_4_after_sleep_2000_1');
    addContext(this, { title: 'Step 4: After Sleep 2s', value: img });

    await driver.findElement(By.linkText("Home")).click();
    img = await saveScreenshot(driver, 'step_5_clicked_Home');
    addContext(this, { title: 'Step 5: Clicked Home', value: img });

    await driver.sleep(2000);
    img = await saveScreenshot(driver, 'step_6_after_sleep_2000_2');
    addContext(this, { title: 'Step 6: After Sleep 2s Again', value: img });

    await driver.executeScript("window.scrollTo(0,290.3999938964844)");
    img = await saveScreenshot(driver, 'step_7_scrolled_290');
    addContext(this, { title: 'Step 7: Scrolled to 290px', value: img });

    await driver.executeScript("window.scrollTo(0,1160.800048828125)");
    img = await saveScreenshot(driver, 'step_8_scrolled_1160');
    addContext(this, { title: 'Step 8: Scrolled to 1160px', value: img });

    await driver.executeScript("window.scrollTo(0,1699.199951171875)");
    img = await saveScreenshot(driver, 'step_9_scrolled_1699');
    addContext(this, { title: 'Step 9: Scrolled to 1699px', value: img });

    await driver.executeScript("window.scrollTo(0,2854.39990234375)");
    img = await saveScreenshot(driver, 'step_10_scrolled_2854');
    addContext(this, { title: 'Step 10: Scrolled to 2854px', value: img });

    await driver.executeScript("window.scrollTo(0,3139.199951171875)");
    img = await saveScreenshot(driver, 'step_11_scrolled_3139');
    addContext(this, { title: 'Step 11: Scrolled to 3139px', value: img });

    await driver.findElement(By.linkText("API Details »")).click();
    img = await saveScreenshot(driver, 'step_12_clicked_API_Details');
    addContext(this, { title: 'Step 12: Clicked API Details', value: img });

    await driver.sleep(2000);
    img = await saveScreenshot(driver, 'step_13_after_sleep_2000_3');
    addContext(this, { title: 'Step 13: After Sleep 2s', value: img });

    await driver.executeScript("window.scrollTo(0,490.3999938964844)");
    img = await saveScreenshot(driver, 'step_14_scrolled_490');
    addContext(this, { title: 'Step 14: Scrolled to 490px', value: img });

    await driver.findElement(By.linkText("https://quotes.rest")).click();
    img = await saveScreenshot(driver, 'step_15_clicked_quotes_rest');
    addContext(this, { title: 'Step 15: Clicked quotes.rest link', value: img });

    // No need to close the driver here since afterEach does it
  });
});
