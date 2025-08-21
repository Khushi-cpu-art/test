const { Builder, By, until } = require('selenium-webdriver');
const addContext = require('mochawesome/addContext');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, 'mochawesome-report', 'screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function saveScreenshot(driver, test, stepName) {
  const img = await driver.takeScreenshot();
  const fileName = `${stepName}.png`;
  const filePath = path.join(screenshotDir, fileName);
  fs.writeFileSync(filePath, img, 'base64');
  addContext(test, {
    title: `Screenshot: ${stepName}`,
    value: `./screenshots/${fileName}`
  });
  console.log(`Screenshot saved: ${filePath}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to click element safely
async function clickElement(driver, element) {
  await driver.wait(until.elementIsVisible(element), 10000);
  await driver.wait(until.elementIsEnabled(element), 10000);
  await element.click();
}

describe('Selenium Steps with Screenshots', function() {
  this.timeout(60000);

  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('should perform steps and take screenshots after each', async function() {
    // Step 1: Load homepage
    await driver.get('https://theysaidso.com/');
    await saveScreenshot(driver, this, 'step_1_homepage');

    // Step 2: Resize window
    await driver.manage().window().setRect({ width: 1074, height: 800 });
    await saveScreenshot(driver, this, 'step_2_window_resized');

    // Step 3: Click "QShows»"
    await driver.wait(until.elementLocated(By.linkText("QShows»")), 10000);
    const qshowsLink = await driver.findElement(By.linkText("QShows»"));
    await clickElement(driver, qshowsLink);
    await saveScreenshot(driver, this, 'step_3_clicked_QShows');

    // Step 4: Click "Home"
    await driver.wait(until.elementLocated(By.linkText("Home")), 10000);
    const homeLink = await driver.findElement(By.linkText("Home"));
    await clickElement(driver, homeLink);
    await saveScreenshot(driver, this, 'step_4_clicked_Home');

    // Step 5: Scroll multiple times with pauses and screenshots
    const scrollPositions = [
      290.4,
      1160.8,
      1699.2,
      2854.4,
      3139.2
    ];

    for (let i = 0; i < scrollPositions.length; i++) {
      await driver.executeScript(`window.scrollTo(0, ${scrollPositions[i]})`);
      await sleep(500);  // wait for page to stabilize
      await saveScreenshot(driver, this, `step_5_scroll_${i + 1}`);
    }

    // Step 6: Click "API Details »" using partial link text and wait
    await driver.wait(until.elementLocated(By.partialLinkText("API Details")), 10000);
    const apiDetailsLink = await driver.findElement(By.partialLinkText("API Details"));
    await clickElement(driver, apiDetailsLink);
    await saveScreenshot(driver, this, 'step_6_clicked_API_Details');

    // Step 7: Scroll a bit and click "https://quotes.rest"
    await driver.executeScript("window.scrollTo(0, 490.4)");
    await sleep(500);
    await saveScreenshot(driver, this, 'step_7_scrolled_before_quotes_rest');

    await driver.wait(until.elementLocated(By.linkText("https://quotes.rest")), 10000);
    const quotesRestLink = await driver.findElement(By.linkText("https://quotes.rest"));
    await clickElement(driver, quotesRestLink);
    await saveScreenshot(driver, this, 'step_8_clicked_quotes_rest');

    // Done
  });
});
