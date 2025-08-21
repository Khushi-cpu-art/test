const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
require('chromedriver');

async function safeClick(driver, element) {
  const rect = await driver.executeScript(
    `const rect = arguments[0].getBoundingClientRect();
     return { x: rect.left + window.scrollX, y: rect.top + window.scrollY };`, element);

  await driver.executeScript(`window.scrollTo(${rect.x}, ${rect.y - 100});`);

  await driver.sleep(500);

  await driver.wait(until.elementIsVisible(element), 5000);
  await driver.wait(until.elementIsEnabled(element), 5000);

  try {
    await element.click();
  } catch (e) {
    console.log('Click intercepted, trying JavaScript click');
    await driver.executeScript("arguments[0].click();", element);
  }
}

async function takeStepScreenshot(driver, stepName) {
  const screenshot = await driver.takeScreenshot();
  const screenshotDir = path.resolve(__dirname, 'mochawesome-report');
  fs.mkdirSync(screenshotDir, { recursive: true });
  const screenshotPath = path.resolve(screenshotDir, `${stepName}.png`);
  fs.writeFileSync(screenshotPath, screenshot, 'base64');
  console.log(`Screenshot saved: ${screenshotPath}`);
}

describe('Converted Selenium Test from IDE with Multiple Screenshots', function () {
  this.timeout(90000);
  let driver;

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--no-sandbox');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get('https://theysaidso.com/');

    // Handle cookie popup if present
    try {
      await driver.wait(until.elementLocated(By.css('button#cookieConsentAccept')), 5000);
      const acceptBtn = await driver.findElement(By.css('button#cookieConsentAccept'));
      await acceptBtn.click();
      await driver.sleep(1000);
      await takeStepScreenshot(driver, 'cookie_accepted');
    } catch (e) {
      console.log('Cookie popup not found or already accepted.');
    }

    await takeStepScreenshot(driver, 'homepage_loaded');
  });

  it('Should navigate and interact with the site, taking screenshots at every step', async function () {
    try {
      await driver.manage().window().setRect({ width: 1074, height: 800 });
      await takeStepScreenshot(driver, 'window_resized');

      // Click "QShows»"
      const qshowsLink = await driver.findElement(By.partialLinkText("QShows"));
      await safeClick(driver, qshowsLink);
      await driver.sleep(2000);
      await takeStepScreenshot(driver, 'clicked_qshows');

      // Click "Home"
      const homeLink = await driver.findElement(By.linkText("Home"));
      await safeClick(driver, homeLink);
      await driver.sleep(2000);
      await takeStepScreenshot(driver, 'clicked_home');

      // Scroll through the page
      const scrollPoints = [290, 1160, 1699, 2854, 3139];
      for (let i = 0; i < scrollPoints.length; i++) {
        const y = scrollPoints[i];
        await driver.executeScript(`window.scrollTo(0, ${y})`);
        await driver.sleep(500);
        await takeStepScreenshot(driver, `scrolled_to_${y}`);
      }

      // Click "API Details »"
      const apiLink = await driver.findElement(By.partialLinkText("API Details"));
      await safeClick(driver, apiLink);
      await driver.sleep(2000);
      await takeStepScreenshot(driver, 'clicked_api_details');

      // Scroll a bit more
      await driver.executeScript("window.scrollTo(0, 490)");
      await driver.sleep(1000);
      await takeStepScreenshot(driver, 'scrolled_to_490');

      // Click "https://quotes.rest" link
      const quotesRestLink = await driver.findElement(By.partialLinkText("https://quotes.rest"));
      await safeClick(driver, quotesRestLink);
      await driver.sleep(2000);
      await takeStepScreenshot(driver, 'clicked_quotes_rest');

    } catch (err) {
      console.error('Test failed:', err);
      throw err;
    }
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
