require('chromedriver'); // <-- Must be first!

const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let driver;

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

after(async function () {
  if (driver) {
    await driver.quit();
    console.log('✅ Chrome closed');
  }
});

function sanitizeName(title) {
  return title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
}

async function attachScreenshot(ctx) {
  const title = ctx?.test?.title || 'screenshot';
  const data = await driver.takeScreenshot();
  const folder = path.resolve('mochawesome-report/screenshots');
  fs.mkdirSync(folder, { recursive: true });

  const file = sanitizeName(title);
  const fullPath = path.join(folder, file);
  fs.writeFileSync(fullPath, data, 'base64');

  ctx.attachments = ctx.attachments || [];
  ctx.attachments.push({
    name: 'Screenshot',
    type: 'image/png',
    path: `screenshots/${file}`
  });
}

describe('Test with embedded screenshots', function () {
  this.timeout(30000);

  it('Step 1: Open homepage', async function () {
    await driver.get('https://theysaidso.com');
    await attachScreenshot(this);
  });

  it('Step 2: Scroll down', async function () {
    await driver.executeScript('window.scrollBy(0, 600)');
    await new Promise(r => setTimeout(r, 500));
    await driver.executeScript('window.scrollBy(0, 800)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 3: Scroll to top', async function () {
    await driver.executeScript('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 4: Check page title', async function () {
    const title = await driver.getTitle();
    console.log('Title:', title);
    await attachScreenshot(this);
  });

  it('Step 5: Footer view', async function () {
    try {
      const footer = await driver.findElement(By.css('footer'));
      await driver.executeScript('arguments[0].scrollIntoView(true);', footer);
      await new Promise(r => setTimeout(r, 1000));
      await attachScreenshot(this);
    } catch (err) {
      console.log('Footer not found. Skipping...');
    }
  });

  it('Step 6: Final snapshot', async function () {
    await attachScreenshot(this);
  });
});
