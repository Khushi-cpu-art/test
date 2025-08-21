const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');

const screenshotsDir = path.resolve(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const saveScreenshot = async (driver, name) => {
  let image = await driver.takeScreenshot();
  let filePath = path.join(screenshotsDir, `${name}.png`);
  fs.writeFileSync(filePath, image, 'base64');
  console.log(`Screenshot saved: ${filePath}`);
};

async function safeClick(driver, locator, screenshotName = null) {
  try {
    let el = await driver.findElement(locator);
    await driver.wait(until.elementIsVisible(el), 5000);
    await driver.wait(until.elementIsEnabled(el), 5000);
    await driver.wait(until.elementIsClickable(el), 5000);
    await el.click();
    if (screenshotName) await saveScreenshot(driver, screenshotName);
  } catch (err) {
    // If click intercepted, try scrolling and retry once
    if (err.name === 'ElementClickInterceptedError') {
      let el = await driver.findElement(locator);
      await driver.executeScript("arguments[0].scrollIntoView(true);", el);
      await driver.sleep(500);
      await el.click();
      if (screenshotName) await saveScreenshot(driver, screenshotName);
    } else {
      console.error('Error clicking element:', err);
      throw err;
    }
  }
}

describe('Converted Selenium Test from IDE with Multiple Screenshots', function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    const tempDir = path.join(os.tmpdir(), `chrome_profile_${Date.now()}`);
    let options = new chrome.Options()
      .addArguments(`--user-data-dir=${tempDir}`);

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
    await saveScreenshot(driver, 'homepage_loaded');

    // Accept cookie popup if present
    try {
      let cookieAcceptBtn = await driver.findElement(By.id('cookie_action_close_header'));
      await cookieAcceptBtn.click();
      await saveScreenshot(driver, 'cookie_handled');
    } catch {
      console.log('Cookie popup not found or already accepted.');
    }

    await driver.manage().window().setRect({width: 1280, height: 1024});
    await saveScreenshot(driver, 'window_resized');

    // Example of clicking "Q & A" (adjust selector if needed)
    await safeClick(driver, By.linkText('Q & A'), 'clicked_qanda');

    // Navigate back to home (adjust selector if needed)
    await safeClick(driver, By.linkText('Home'), 'clicked_home');

    // Scroll down in steps and take screenshots
    const scrollPositions = [290, 1160, 1699, 2854, 3139];
    for (let pos of scrollPositions) {
      await driver.executeScript(`window.scrollTo(0, ${pos});`);
      await driver.sleep(1000);
      await saveScreenshot(driver, `scrolled_to_${pos}`);
    }

    // Click on "API Details »" link (note the space and special char)
    await safeClick(driver, By.partialLinkText('API Details »'), 'clicked_api_details');

    // Add more interactions and screenshots as needed...
  });
});
