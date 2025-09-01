require('chromedriver');  // Ensure ChromeDriver is loaded

const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let driver;

// Setup before all tests
before(async function () {
  this.timeout(20000);

  // Kill lingering Chrome processes (safe in CI)
  if (process.platform !== 'win32') {
    try {
      execSync('pkill -f chrome');
    } catch (err) {
      console.log('⚠️ No Chrome processes found or pkill not supported. Continuing.');
    }
  }

  // Chrome options
  const options = new chrome.Options();
  options.addArguments(
    '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080'
  );

  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
});

// Cleanup after all tests
after(async function () {
  if (driver) {
    await driver.quit();
    console.log('✅ Chrome closed');
  }
});

// Utility to create a filename-safe image name
function sanitizeName(title) {
  return title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
}

// Attach screenshot to the Mochawesome report
async function attachScreenshot(ctx) {
  const title = ctx?.test?.title || 'screenshot';
  const data = await driver.takeScreenshot();
  const folder = path.resolve('mochawesome-report/screenshots');
  fs.mkdirSync(folder, { recursive: true });

  const fileName = sanitizeName(title);
  const fullPath = path.join(folder, fileName);
  fs.writeFileSync(fullPath, data, 'base64');

  // Attach screenshot to Mochawesome using Mocha's `this.attach()` method
  if (typeof ctx.attach === 'function') {
    ctx.attach(fs.readFileSync(fullPath), 'image/png');
  } else {
    console.log('Failed to attach screenshot');
    ctx.test.context = `![Screenshot](screenshots/${fileName})`; // Fallback if no attach() function
  }
}

// Test suite: Selenium multi-step test with multiple screenshots
describe('Selenium Multi-Step Test with Multiple Screenshots', function () {
  this.timeout(30000);

  it('Step 1: Open homepage', async function () {
    console.log('Running Step 1: Open homepage');
    await driver.get('https://theysaidso.com');
    await attachScreenshot(this);
  });

  it('Step 2: Scroll down', async function () {
    console.log('Running Step 2: Scroll down');
    await driver.executeScript('window.scrollBy(0, 600)');
    await new Promise(r => setTimeout(r, 500));
    await driver.executeScript('window.scrollBy(0, 800)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 3: Scroll to top', async function () {
    console.log('Running Step 3: Scroll to top');
    await driver.executeScript('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 4: Get title', async function () {
    console.log('Running Step 4: Get title');
    const title = await driver.getTitle();
    console.log('Title:', title);
    await attachScreenshot(this);
  });

  it('Step 5: Hover over footer', async function () {
    console.log('Running Step 5: Hover over footer');
    try {
      const footer = await driver.findElement(By.css('footer'));
      await driver.executeScript('arguments[0].scrollIntoView(true);', footer);
      await new Promise(r => setTimeout(r, 1000));
      await attachScreenshot(this);
    } catch (err) {
      console.log('Footer not found. Skipping...');
    }
  });

  it('Step 6: Final screenshot', async function () {
    console.log('Running Step 6: Final screenshot');
    await attachScreenshot(this);
  });
});
