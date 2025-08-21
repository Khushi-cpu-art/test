const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
require('chromedriver');

async function takeStepScreenshot(driver, name) {
  const screenshot = await driver.takeScreenshot();
  const screenshotPath = path.resolve(__dirname, 'mochawesome-report', `${name}.png`);
  fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
  fs.writeFileSync(screenshotPath, screenshot, 'base64');
  console.log(`Screenshot saved: ${screenshotPath}`);
}

async function safeClick(driver, element) {
  try {
    await driver.wait(until.elementIsVisible(element), 5000);
    await driver.wait(until.elementIsEnabled(element), 5000);
    await element.click();
  } catch (err) {
    console.error('Error clicking element:', err);
    throw err;
  }
}

describe('Converted Selenium Test from IDE with Multiple Screenshots', function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--no-sandbox');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get('https://theysaidso.com/');
    await takeStepScreenshot(driver, 'homepage_loaded');

    // Accept cookies if popup present
    try {
      await driver.wait(until.elementLocated(By.css('button#cookieConsentAccept')), 5000);
      const acceptBtn = await driver.findElement(By.css('button#cookieConsentAccept'));
      await safeClick(driver, acceptBtn);
      await driver.sleep(1000); // wait for popup to close
    } catch (e) {
      console.log('Cookie popup not found or already accepted.');
    }
    await takeStepScreenshot(driver, 'cookie_handled');
  });

  it('Should navigate and interact with the site, taking screenshots at every step', async function () {
    // Resize window
    await driver.manage().window().setRect({ width: 1074, height: 800 });
    await takeStepScreenshot(driver, 'window_resized');

    // Click "QShows»" link
    await driver.wait(until.elementLocated(By.linkText("QShows»")), 10000);
    const qshowsLink = await driver.findElement(By.linkText("QShows»"));
    await safeClick(driver, qshowsLink);
    await driver.sleep(2000);
    await takeStepScreenshot(driver, 'clicked_qshows');

    // Click "Home" link
    await driver.wait(until.elementLocated(By.linkText("Home")), 10000);
    const homeLink = await driver.findElement(By.linkText("Home"));
    await safeClick(driver, homeLink);
    await driver.sleep(2000);
    await takeStepScreenshot(driver, 'clicked_home');

    // Scroll multiple positions and take screenshots
    const scrollPositions = [290, 1160, 1699, 2854, 3139];
    for (const pos of scrollPositions) {
      await driver.executeScript(`window.scrollTo(0, ${pos})`);
      await driver.sleep(1000);
      await takeStepScreenshot(driver, `scrolled_to_${pos}`);
    }

    // Wait and click "API Details »"
    await driver.wait(until.elementLocated(By.linkText("API Details »")), 10000);
    const apiDetailsLink = await driver.findElement(By.linkText("API Details »"));
    await safeClick(driver, apiDetailsLink);
    await driver.sleep(2000);
    await takeStepScreenshot(driver, 'clicked_api_details');

    // Click on "https://quotes.rest" link on that page
    await driver.wait(until.elementLocated(By.linkText("https://quotes.rest")), 10000);
    const quotesRestLink = await driver.findElement(By.linkText("https://quotes.rest"));
    await safeClick(driver, quotesRestLink);
    await driver.sleep(2000);
    await takeStepScreenshot(driver, 'clicked_quotes_rest');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
