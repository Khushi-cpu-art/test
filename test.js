const { execSync } = require('child_process');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

before(async function() {
  // Kill any existing Chrome processes to avoid user-data-dir conflicts
  try {
    execSync('pkill -f chrome');
    console.log('Killed existing Chrome processes.');
    await new Promise(r => setTimeout(r, 2000));  // wait 2 seconds
  } catch (e) {
    console.log('No existing Chrome processes found.');
  }

  let options = new chrome.Options();
  
  // Add headless & disable GPU for CI environments
  options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');  // required for some CI environments
  options.addArguments('--disable-dev-shm-usage'); // avoid /dev/shm issues
  options.addArguments('--window-size=1920,1080');

  global.driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  console.log('Chrome WebDriver started in headless mode.');
});

describe('Sample Selenium Test', function() {
  this.timeout(30000);

  it('should open a page and check title', async function() {
    const driver = global.driver;
    await driver.get('http://theysaidso.com/');

    const title = await driver.getTitle();
    console.log('Page title:', title);

    assert.ok(title.length > 0, 'Title is empty');
  });
});

after(async function() {
  if (global.driver) {
    await global.driver.quit();
    console.log('Chrome WebDriver quit.');
  }
});
