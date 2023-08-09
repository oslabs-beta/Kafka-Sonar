import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-puppeteer', // basis of config, allows using Jest with Puppeteer to do E2E testing
  globals: { URL: '<http://localhost:5175>' }, // vars available to entire test suite. URL points to where the app is running.
  verbose: true, // provides more logs for run tests
};

export default config;
