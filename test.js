const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const addContext = require('mochawesome/addContext');

const screenshotDir = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, testContext, stepName) {
  const img = await driver.takeScreenshot();
  const filePath = path.join(screenshotDir, `${stepName}.png`);
  fs.writeFileSync(filePath, img, 'base64');
  console.log(`Screenshot saved: ${filePath}`);
  // Add screenshot to mochawesome report context
  addContext(testContext, filePath);
}

async function scrollToElement(driver, element) {
  await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'})", element);
  await driver.sleep(700); // wait for scrolling and UI to settle
}

async function clickElement(driver, element) {
  await driver.wait(until.elementIsVisible(element), 10000);
  await driver.wait(until.elementIsEnabled(element), 10000);
  await scrollToElement(driver, element);
  await element.click();
  await driver.sleep(500); // wait for click effect
}

describe('Selenium Steps with Screenshots', function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    const options = new chrome.Options()
      .addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should perform steps and take screenshots after each', async function () {
    // Step 1: Load homepage
    await driver.get('https://theysaidso.com/');
    await saveScreenshot(driver, this, 'step_1_homepage');

    // Step 2: Resize window
    await driver.manage().window().setRect({ width: 1074, height: 800 });
    await saveScreenshot(driver, this, 'step_2_window_resized');

    // Step 3: Click "QShows»"
    const qshowsLink = await driver.findElement(By.linkText("QShows»"));
    await clickElement(driver, qshowsLink);
    await saveScreenshot(driver, this, 'step_3_clicked_QShows');

    // Step 4: Click "Home"
    const homeLink = await driver.findElement(By.linkText("Home"));
    await clickElement(driver, homeLink);
    await saveScreenshot(driver, this, 'step_4_clicked_Home');

    // Step 5: Scroll through the page with small pauses
    const scrollPositions = [290, 1160, 1699, 2854, 3139];
    for (let i = 0; i < scrollPositions.length; i++) {
      await driver.executeScript(`window.scrollTo(0, ${scrollPositions[i]})`);
      await driver.sleep(700);
      await saveScreenshot(driver, this, `step_5_scroll_${i + 1}`);
    }

    // Step 6: Click "API Details »"
    const apiDetailsLink = await driver.findElement(By.linkText("API Details »"));
    await clickElement(driver, apiDetailsLink);
    await saveScreenshot(driver, this, 'step_6_clicked_API_Details');

    // Step 7: Scroll a bit
    await driver.executeScript("window.scrollTo(0, 490)");
    await driver.sleep(700);
    await saveScreenshot(driver, this, 'step_7_scrolled_490');

    // Step 8: Click "https://quotes.rest"
    const quotesRestLink = await driver.findElement(By.linkText("https://quotes.rest"));
    await clickElement(driver, quotesRestLink);
    await saveScreenshot(driver, this, 'step_8_clicked_quotes_rest');

    // Close driver at end (optional, mocha after hook will quit as well)
    // await driver.close();
  });
});
