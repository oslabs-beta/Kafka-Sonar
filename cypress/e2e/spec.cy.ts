// Tests work in spite of type errors. To jumpstart testing, refer to this E2E test example: https://github.com/Invest-Share/Invest-Share/blob/main/client/cypress/e2e/spec.cy.ts

describe('template spec', () => {
  it('passes', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.visit('/signup');
    cy.wait(1000);
    cy.visit('/connect');
    cy.wait(1000);
    cy.visit('/cluster');
    cy.wait(1000);
    cy.visit('/broker');
    cy.wait(1000);
    cy.visit('/consumer');
    cy.wait(1000);
  });
});
