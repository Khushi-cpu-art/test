const { execSync } = require('child_process');
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

let driver;

function getFileName(title) {
  return title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
}

async function attachScreenshot(ctx) {
  const title = ctx?.test?.title || 'screenshot';
  const screenshot = await driver.takeScreenshot();
  const dir = path.resolve('mochawesome-report/screenshots');
  fs.mkdirSync(dir, { recursive: true });

  const filename = getFileName(title);
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, screenshot, 'base64');

  ctx.attachments = ctx.attachments || [];
  ctx.attachments.push({
    name: 'Screenshot',
    type: 'image/png',
    path: `screenshots/${filename}`
  });
}

before(async function () {
  this.timeout(20000);
  try {
    execSync('pkill -f chrome || true');
    await new Promise(r => setTimeout(r, 1000));
  } catch {}
  const options = new chrome.Options()
    .addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
});

describe('🧪 Selenium Test with Embedded Screenshots', function () {
  this.timeout(30000);

  it('Step 1: Load homepage', async function () {
    await driver.get('https://theysaidso.com');
    await attachScreenshot(this);
  });

  it('Step 2: Scroll down', async function () {
    await driver.executeScript("window.scrollBy(0, 600)");
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 3: Scroll to top', async function () {
    await driver.executeScript("window.scrollTo(0, 0)");
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 4: Grab title', async function () {
    const title = await driver.getTitle();
    console.log('Page title:', title);
    await attachScreenshot(this);
  });

  it('Step 5: Footer view', async function () {
    const footer = await driver.findElement(By.css('footer'));
    await driver.executeScript("arguments[0].scrollIntoView(true);", footer);
    await new Promise(r => setTimeout(r, 1000));
    await attachScreenshot(this);
  });

  it('Step 6: Final snapshot', async function () {
    await attachScreenshot(this);
  });
});

after(async function () {
  if (driver) await driver.quit();
});
