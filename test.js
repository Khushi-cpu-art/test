it('Should load page and take screenshot', async function () {
  await driver.get('https://theysaidso.com');

  const title = await driver.getTitle();
  assert.ok(title.includes('They Said So'), 'Page title does not include "They Said So"');

  // Screenshot
  const screenshotBase64 = await driver.takeScreenshot();

  // Save screenshot as file too (optional)
  const screenshotDir = path.resolve(__dirname, 'mochawesome-report');
  fs.mkdirSync(screenshotDir, { recursive: true });
  fs.writeFileSync(path.join(screenshotDir, 'screenshot_01.png'), screenshotBase64, 'base64');

  // Attach inline image in Mochawesome report
  if (this.test && this.test.context) {
    this.test.context.attach = {
      title: 'Screenshot',
      value: `<img src="data:image/png;base64,${screenshotBase64}" width="600"/>`,
    };
  } else if (this.test) {
    this.test.context = {
      title: 'Screenshot',
      value: `<img src="data:image/png;base64,${screenshotBase64}" width="600"/>`,
    };
  }
});
