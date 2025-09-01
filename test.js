const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const addContext = require('mochawesome/addContext');

let driver;

describe('Selenium + Mochawesome Test with Embedded Screenshots', function () {
  this.timeout(60000);

  before(async () => {
    const options = new chrome.Options();
    options.addArguments(
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  // Helper to take screenshot and add context to report
  async function takeScreenshotAndAttach(ctx, title) {
    const screenshotBase64 = await driver.takeScreenshot();
    addContext(ctx, {
      title,
      value: `data:image/png;base64,${screenshotBase64}`
    });
  }

  it('Step 1: Open theysaidso.com', async function () {
    await driver.get('https://theysaidso.com');
    await takeScreenshotAndAttach(this, 'Step 1: Open theysaidso.com');
  });

  it('Step 2: Scroll down 300px', async function () {
    await driver.executeScript('window.scrollBy(0, 300)');
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshotAndAttach(this, 'Step 2: Scroll down 300px');
  });

  it('Step 3: Scroll down 600px', async function () {
    await driver.executeScript('window.scrollBy(0, 600)');
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshotAndAttach(this, 'Step 3: Scroll down 600px');
  });

  it('Step 4: Scroll back to top', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshotAndAttach(this, 'Step 4: Scroll back to top');
  });

  it('Step 5: Open Google', async function () {
    await driver.get('https://www.google.com');
    await takeScreenshotAndAttach(this, 'Step 5: Open Google');
  });

  it('Step 6: Search for Selenium', async function () {
    let searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('Selenium WebDriver');
    await takeScreenshotAndAttach(this, 'Step 6: Enter search term');
  });

  it('Step 7: Submit search form', async function () {
    let searchBox = await driver.findElement(By.name('q'));
    await searchBox.submit();
    await new Promise(r => setTimeout(r, 3000)); // wait for results
    await takeScreenshotAndAttach(this, 'Step 7: Search results page');
  });

  it('Step 8: Open first search result', async function () {
    let firstResult = await driver.findElement(By.css('h3'));
    await firstResult.click();
    await new Promise(r => setTimeout(r, 3000));
    await takeScreenshotAndAttach(this, 'Step 8: First search result page');
  });

  it('Step 9: Scroll to bottom', async function () {
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    await new Promise(r => setTimeout(r, 1000));
    await takeScreenshotAndAttach(this, 'Step 9: Scroll to bottom');
  });

  it('Step 10: Final screenshot', async function () {
    await takeScreenshotAndAttach(this, 'Step 10: Final screenshot');
  });

  after(async () => {
    if (driver) {
      await driver.quit();
      console.log('Browser closed');
    }
  });
});
