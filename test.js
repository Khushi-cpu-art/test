const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const os = require('os');
const path = require('path');
const fs = require('fs');

describe('Selenium Steps with Screenshots', function() {
  this.timeout(60000);
  let driver;

  before(async function() {
    // Create a unique temporary user data directory for Chrome
    const tmpDir = path.join(os.tmpdir(), `chrome-user-data-${Date.now()}`);
    fs.mkdirSync(tmpDir);

    let options = new chrome.Options();
    options.addArguments(`--user-data-dir=${tmpDir}`);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  it('should perform steps and take screenshots after each', async function() {
    // Helper function to take screenshot and log
    async function takeScreenshot(stepName) {
      const screenshot = await driver.takeScreenshot();
      const filePath = `mochawesome-report/step_${stepName}.png`;
      require('fs').writeFileSync(filePath, screenshot, 'base64');
      console.log(`Screenshot saved: ${filePath}`);
    }

    // Step 1: Load page
    await driver.get("https://theysaidso.com/");
    await takeScreenshot('1_homepage');

    // Step 2: Resize window
    await driver.manage().window().setRect({ width: 1074, height: 800 });
    await takeScreenshot('2_window_resized');

    // Step 3: Click "QShows»"
    await driver.findElement(By.linkText("QShows»")).click();
    await driver.sleep(1000); // wait for navigation
    await takeScreenshot('3_clicked_QShows');

    // Step 4: Click "Home"
    await driver.findElement(By.linkText("Home")).click();
    await driver.sleep(1000);
    await takeScreenshot('4_clicked_Home');

    // Step 5: Scroll steps with screenshots
    const scrollPositions = [290, 1160, 1699, 2854, 3139];
    for (let i = 0; i < scrollPositions.length; i++) {
      await driver.executeScript(`window.scrollTo(0, ${scrollPositions[i]})`);
      await driver.sleep(500); // small wait to stabilize
      await takeScreenshot(`5_scroll_${i+1}`);
    }

    // Step 6: Click "API Details »"
    await driver.findElement(By.linkText("API Details »")).click();
    await driver.sleep(1000);
    await takeScreenshot('6_clicked_API_Details');

    // Step 7: Scroll a bit and click the API link
    await driver.executeScript("window.scrollTo(0,490)");
    await driver.sleep(500);
    await driver.findElement(By.linkText("https://quotes.rest")).click();
    await takeScreenshot('7_clicked_API_Link');
  });
});
