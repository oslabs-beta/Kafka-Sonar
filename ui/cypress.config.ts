import { defineConfig } from 'cypress';

// Add env vars to test OAuth! See this GitHub OAuth w/ PassportJS Cypress TS config example: https://github.com/Invest-Share/Invest-Share/blob/main/client/cypress.config.ts

export default defineConfig({
  // See https://docs.cypress.io/guides/references/configuration#e2e
  // See https://docs.cypress.io/guides/references/configuration#component
  e2e: {
    baseUrl: 'http://localhost:5175/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    supportFile: './cypress/support/component.ts',
    specPattern: '**/*.cy.{js,jsx,ts,tsx}',
  },
});
