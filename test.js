const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const addContext = require('mochawesome-add-context');

describe('Selenium Test with Embedded Screenshots', function () {
  this.timeout(60000);
  let driver;

  // Helper to save screenshot and embed it in mochawesome
  async function saveScreenshot(testContext, driver, stepName) {
    const img = await driver.takeScreenshot();
    const imgBase64 = `data:image/png;base64,${img}`;
    addContext(testContext, {
      title: stepName,
      value: imgBase64,
    });
  }

  before(async () => {
    const options = new chrome.Options()
      .addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('should navigate and take screenshots after each step', async function () {
    await driver.get('https://theysaidso.com/');
    await saveScreenshot(this, driver, 'Loaded homepage');

    await driver.manage().window().setRect({ width: 1074, height: 800 });
    await saveScreenshot(this, driver, 'Resized window');

    // Click on "QShows»" link
    const qshowsLink = await driver.wait(until.elementLocated(By.linkText('QShows»')), 10000);
    await qshowsLink.click();
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Clicked QShows link');

    // Click on "Home" link
    const homeLink = await driver.wait(until.elementLocated(By.linkText('Home')), 10000);
    await homeLink.click();
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Clicked Home link');

    // Scroll multiple times with sleeps
    await driver.executeScript('window.scrollTo(0, 290.4)');
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Scrolled to 290.4px');

    await driver.executeScript('window.scrollTo(0, 1160.8)');
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Scrolled to 1160.8px');

    await driver.executeScript('window.scrollTo(0, 1699.2)');
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Scrolled to 1699.2px');

    await driver.executeScript('window.scrollTo(0, 2854.4)');
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Scrolled to 2854.4px');

    await driver.executeScript('window.scrollTo(0, 3139.2)');
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Scrolled to 3139.2px');

    // Click on "API Details »" link
    const apiDetailsLink = await driver.wait(until.elementLocated(By.linkText('API Details »')), 10000);
    await apiDetailsLink.click();
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Clicked API Details link');

    // Scroll and click external link
    await driver.executeScript('window.scrollTo(0, 490.4)');
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Scrolled to 490.4px');

    const externalLink = await driver.wait(until.elementLocated(By.linkText('https://quotes.rest')), 10000);
    await externalLink.click();
    await driver.sleep(500);
    await saveScreenshot(this, driver, 'Clicked external https://quotes.rest link');
  });
});
