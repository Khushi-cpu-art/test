const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const addContext = require('mochawesome/addContext');

describe('Selenium Test with Step-wise Screenshots', function () {
  this.timeout(60000);
  let driver;

  async function saveScreenshot(driver) {
    const img = await driver.takeScreenshot();
    return `data:image/png;base64,${img}`;
  }

  before(async function () {
    let options = new chrome.Options()
      .addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should interact with page and take screenshots after each step', async function () {
    // Step 1: Load the page
    await driver.get('https://theysaidso.com/');
    let imgBase64 = await saveScreenshot(driver);
    addContext(this, { title: 'Page Loaded', value: imgBase64 });

    // Step 2: Wait for a specific element to appear (example: a header or some element)
    const quoteElem = await driver.wait(
      until.elementLocated(By.css('.qod-quote')),
      10000
    );
    // Take screenshot after element is found
    imgBase64 = await saveScreenshot(driver);
    addContext(this, { title: 'Quote Element Loaded', value: imgBase64 });

    // Step 3: Interact with the page - e.g. click a button or link if available
    // (Modify selector below to something real on the page)
    // await driver.findElement(By.css('button#some-button')).click();

    // For demo, let's just wait 2 seconds after "interaction"
    await driver.sleep(2000);

    // Take screenshot after interaction/wait
    imgBase64 = await saveScreenshot(driver);
    addContext(this, { title: 'After Interaction / Wait', value: imgBase64 });
  });
});
