// Can specify options in EITHER puppeteer.launch() or jest-puppeteer.config.ts.

module.exports = {
  // before test runs, enables specific options for Chrome or chromium instance
  launch: {
    headless: false,
    // By default, the timeout is 30 seconds in puppeteer which is not usually enough time for  code to run. slowMo delays test actions by 35 milliseconds to see every puppeteer action in the browser.
    // slowMo: 30,
  },
};
