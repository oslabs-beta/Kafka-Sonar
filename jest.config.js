/** @type {import('jest').Config} */
const config = {
  preset: 'jest-puppeteer', // basis of config, allows using Jest with Puppeteer to do E2E testing
  // globals: { URL: '<http://localhost:5175>' }, // vars available to entire test suite. URL points to where the app is running.
  verbose: true, // provides more logs for run tests
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(cjs|jsx?|tsx?)$',
  // testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testMatch: ['**/App.test.js'],
};

module.exports = config;
