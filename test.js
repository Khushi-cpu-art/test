const { execSync } = require('child_process');
const os = require('os');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

before(async function() {
  // Kill existing Chrome processes to free up user-data-dir
  try {
    execSync('pkill -f chrome');
    console.log('Killed existing Chrome processes.');
  } catch (e) {
    console.log('No existing Chrome processes found.');
  }

  // Create unique temp user-data-dir for Chrome
  const tmpDir = path.join(os.tmpdir(), `chrome-user-data-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  // Setup Chrome options with unique user-data-dir
  let options = new chrome.Options();
  options.addArguments(`--user-data-dir=${tmpDir}`);

  // Build driver with these options
  global.driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  console.log('Chrome WebDriver started with unique user-data-dir:', tmpDir);
});

// Your tests here...

after(async function() {
  if (global.driver) {
    await global.driver.quit();
  }
});
