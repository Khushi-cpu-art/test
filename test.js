const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
require('chromedriver');

async function safeClick(driver, element) {
  await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
  await driver.sleep(500); // Allow scroll animation to complete
  await element.click();
}

describe('Converted Selenium Test from IDE', function () {
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

    // Handle cookie popup if present
    try {
      await driver.wait(until.elementLocated(By.css('button#cookieConsentAccept')), 5000);
      const acceptBtn = await driver.findElement(By.css('button#cookieConsentAccept'));
      await acceptBtn.click();
      await driver.sleep(1000);
    } catch (e) {
      console.log('Cookie popup not found or already accepted.');
    }
  });

  it('Should navigate and interact with the site', async function () {
    try {
      await driver.manage().window().setRect({ width: 1074, height: 800 });

      // Click "QShows»"
      const qshowsLink = await driver.findElement(By.partialLinkText("QShows"));
      await safeClick(driver, qshowsLink);
      await driver.sleep(2000);

      // Click "Home"
      const homeLink = await driver.findElement(By.linkText("Home"));
      await safeClick(driver, homeLink);
      await driver.sleep(2000);

      // Scroll through the page (optional smooth scrolling)
      const scrollPoints = [290, 1160, 1699, 2854, 3139];
      for (const y of scrollPoints) {
        await driver.executeScript(`window.scrollTo(0, ${y})`);
        await driver.sleep(500);
      }

      // Click "API Details »"
      const apiLink = await driver.findElement(By.partialLinkText("API Details"));
      await safeClick(driver, apiLink);
      await driver.sleep(2000);

      // Scroll again to element (if needed)
      await driver.executeScript("window.scrollTo(0, 490)");
      await driver.sleep(1000);

      // Click "https://quotes.rest" link
      const quotesRestLink = await driver.findElement(By.partialLinkText("https://quotes.rest"));
      await safeClick(driver, quotesRestLink);
      await driver.sleep(2000);

      // Take screenshot
      const screenshot = await driver.takeScreenshot();
      const screenshotPath = path.resolve(__dirname, 'mochawesome-report', 'screenshot.png');
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
      fs.writeFileSync(screenshotPath, screenshot, 'base64');
      console.log(`Screenshot saved to ${screenshotPath}`);

      this.test.context = `data:image/png;base64,${screenshot}`;
    } catch (err) {
      console.error('Test failed:', err);
      throw err; // Fail the test on error
    }
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
