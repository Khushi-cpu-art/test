const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const screenshotDir = path.join(__dirname, 'mochawesome-report');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function takeScreenshot(driver, name) {
  const image = await driver.takeScreenshot();
  const filePath = path.join(screenshotDir, `${name}.png`);
  fs.writeFileSync(filePath, image, 'base64');
  console.log(`Screenshot saved: ${filePath}`);
}

async function waitForNoOverlays(driver) {
  // Customize selectors as per your site overlays/popups/modals etc.
  await driver.wait(async () => {
    const overlays = await driver.findElements(By.css('.overlay, .popup, .modal, .loading, #cookie-banner'));
    // Return true if none found (overlays gone)
    return overlays.length === 0;
  }, 5000, 'Waiting for overlays/popups to disappear timed out');
}

async function safeClick(driver, element) {
  try {
    await driver.wait(until.elementIsVisible(element), 5000);
    await driver.wait(until.elementIsEnabled(element), 5000);
    await waitForNoOverlays(driver);
    // Scroll element into view center before clicking
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
    await driver.sleep(500); // wait a bit for smooth scrolling or animations
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
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should navigate and interact with the site, taking screenshots at every step', async function () {
    // 1. Open website
    await driver.get('https://theysaidso.com/');  // change to your URL
    await driver.manage().window().setRect({ width: 1200, height: 800 });
    await takeScreenshot(driver, 'homepage_loaded');

    // 2. Handle cookie popup if present
    try {
      const cookieBtn = await driver.findElement(By.id('accept-cookies'));
      await safeClick(driver, cookieBtn);
      await takeScreenshot(driver, 'cookie_handled');
    } catch {
      console.log('Cookie popup not found or already accepted.');
    }

    // 3. Resize window as a step
    await driver.manage().window().setRect({ width: 1024, height: 768 });
    await takeScreenshot(driver, 'window_resized');

    // 4. Click some link/button by partial link text
    const someLink = await driver.findElement(By.partialLinkText('API Details »'));
    await safeClick(driver, someLink);
    await takeScreenshot(driver, 'clicked_api_details');

    // 5. Scroll through page in multiple steps with screenshots
    const scrollPoints = [200, 600, 1000, 1400];
    for (const point of scrollPoints) {
      await driver.executeScript(`window.scrollTo(0, ${point});`);
      await driver.sleep(500);
      await takeScreenshot(driver, `scrolled_to_${point}`);
    }

    // Add more interactions and screenshots as needed...

  });
});
