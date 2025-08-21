const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

async function takeScreenshot(driver, name) {
  let image = await driver.takeScreenshot();
  let filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
  fs.writeFileSync(filePath, image, 'base64');
  console.log(`Screenshot saved: ${filePath}`);
}

async function safeClick(driver, element) {
  try {
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    await driver.wait(until.elementIsVisible(element), 5000);
    await driver.wait(until.elementIsEnabled(element), 5000);
    await element.click();
  } catch (err) {
    console.error('Error clicking element:', err.message);
  }
}

describe('Converted Selenium Test from IDE with Multiple Screenshots', function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    // Setup Chrome options - NO --user-data-dir to avoid session conflict
    let options = new chrome.Options();

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('Should navigate and interact with the site, taking screenshots at every step', async () => {
    await driver.get('https://theysaidso.com/');
    await takeScreenshot(driver, 'homepage_loaded');

    // Example interaction: accept cookie popup if it exists
    try {
      let cookieButton = await driver.findElement(By.id('cookie_action_close_header'));
      await safeClick(driver, cookieButton);
      await takeScreenshot(driver, 'cookie_handled');
    } catch {
      console.log('Cookie popup not found or already accepted.');
    }

    await driver.manage().window().setRect({width: 1280, height: 800});
    await takeScreenshot(driver, 'window_resized');

    // Example: click on "Q" shows link
    let qShowsLink = await driver.findElement(By.partialLinkText('Q'));
    await safeClick(driver, qShowsLink);
    await takeScreenshot(driver, 'clicked_qshows');

    // Navigate back
    await driver.navigate().back();
    await takeScreenshot(driver, 'clicked_home');

    // Scroll to various positions and take screenshots
    let scrollPositions = [290, 1160, 1699, 2854, 3139];
    for (let pos of scrollPositions) {
      await driver.executeScript(`window.scrollTo(0, ${pos});`);
      await driver.sleep(500);
      await takeScreenshot(driver, `scrolled_to_${pos}`);
    }

    // Try clicking the API Details link with exact text
    try {
      let apiDetailsLink = await driver.findElement(By.linkText('API Details »'));
      await safeClick(driver, apiDetailsLink);
      await takeScreenshot(driver, 'clicked_api_details');
    } catch (e) {
      console.error('API Details link not found:', e.message);
    }
  });
});
