const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const addContext = require('mochawesome/addContext');
const fs = require('fs');
const os = require('os');
const path = require('path');

describe('Selenium Steps with Screenshots', function () {
  this.timeout(30000);
  let driver;
  let tmpDir;

  before(async function () {
    tmpDir = path.join(os.tmpdir(), `chrome-user-data-${Date.now()}-${Math.floor(Math.random() * 10000)}`);
    fs.mkdirSync(tmpDir);

    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${tmpDir}`);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  async function takeScreenshot(test, stepName) {
    const img = await driver.takeScreenshot();
    const screenshotsDir = path.join(__dirname, 'mochawesome-report', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    const filePath = path.join(screenshotsDir, `${stepName}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    addContext(test, {
      title: stepName,
      value: filePath,
    });
  }

  it('should perform steps and take screenshots after each', async function () {
    // Load page
    await driver.get('http://theysaidso.com/');
    await takeScreenshot(this.test, 'step_1_page_loaded');

    // Resize window
    await driver.manage().window().setRect({ width: 1200, height: 800 });
    await takeScreenshot(this.test, 'step_2_window_resized');

    // Click something (replace with your actual selector)
    const someElement = await driver.findElement(By.linkText('More information...'));
    await someElement.click();
    await driver.sleep(500); // small delay for page stability
    await takeScreenshot(this.test, 'step_3_clicked_more_info');

    // Scroll example
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    await driver.sleep(500);
    await takeScreenshot(this.test, 'step_4_scrolled');

    // Add more steps as needed...
  });
});
