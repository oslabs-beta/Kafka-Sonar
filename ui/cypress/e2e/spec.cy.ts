// Refer to Iteration E2E test example: https://github.com/Invest-Share/Invest-Share/blob/main/client/cypress/e2e/spec.cy.ts

describe('Kafka Sonar', () => {
  it('successfully registers a new user', () => {
    cy.wait(3000);
    cy.visit('/');
    cy.wait(3000);
    cy.get('a').click();
    cy.url().should('eq', 'http://localhost:5175/#/signup');
    cy.get('.MuiPaper-root').within(() => {
      cy.get('input[name=email]').type('testuser');
      cy.get('input[name=password]').type('testuser');
      cy.get('button').click();
    });
  });
  it('successfully logs in an existing user and logs out', () => {
    // log in
    cy.wait(3000);
    cy.visit('/');
    cy.wait(3000);
    cy.get('.MuiPaper-root').within(() => {
      cy.get('input[name=email]').type('upnata@gmail.com');
      cy.get('input[name=password]').type('fiona!94');
      cy.get('button').click();
    });
    // check we're on Saved Connections page
    cy.wait(3000);
    cy.url().should('eq', 'http://localhost:5175/#/saved');
    // click Log Out
    cy.get('.MuiDrawer-root').within(() => {
      cy.get('div[role=button]').filter(':contains("Log Out")').click();
    });
  });
});

/*

describe('App', () => {
  it('successfully registers new user and logs out', () => {
    cy.visit('http://localhost:3000/register');
    // fills registration form
    cy.get('form').within(() => {
      cy.get('input[name=firstName]').type('Indecisive');
      cy.get('input[name=lastName]').type('Investor');
      cy.get('input[name=email]').type('ii@cs.com');
      cy.get('input[name=password]').type('123tyu');
      cy.get('button').click();
    });
    // logs out newly registered user
    cy.get('.css-rpp4xf > .MuiBox-root').click();
    cy.get('ul[role = menu]').should('be.visible');
    cy.get('li[role = menuitem]').filter(':contains("Log Out")').click();
    cy.wait(3000);
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('successfully logs in existing user (Upasana N) with built-in form, navigates whole app, and logs out', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('form').within(() => {
      cy.get('input[name=email]').type(Cypress.env('GITHUB_EMAIL'));
      cy.get('input[name=password]').type(Cypress.env('GITHUB_PW'));
      cy.get('button').click();
    });
    cy.get('.css-1o7ozsq-MuiTypography-root').should(
      'have.text',
      'Hello Upasana! '
    );

    // Navigate to My Profile
    cy.get('div[role=button]').filter(':contains("My Profile")').click();

    // Can purchase stock
    cy.get('input[name=ticker]').type('MSFT');
    cy.get('input[name=stock_quantity]').type('5');
    cy.get('button').filter(':contains("BUY")').click();
    cy.get('tr')
      .filter(':contains("MSFT")')
      .within(() => {
        cy.get('td').filter(':contains("5")').should('be.visible');
      });

    // Can sell stock
    cy.get('input[name=ticker]').type('MSFT');
    cy.get('input[name=stock_quantity]').type('5');
    cy.get('button').filter(':contains("SELL")').click();

    // Throws an error if you oversell
    cy.get('input[name=ticker]').type('MSFT');
    cy.get('input[name=stock_quantity]').type('99');
    cy.get('button').filter(':contains("SELL")').click();
    cy.wait(3000);

    // Navigate to Friends
    cy.get('div[role=button]').filter(':contains("Friends")').click();

    // Add a friend
    cy.get('input[name=first_name]').type('David');
    cy.get('input[name=last_name]').type('An');
    cy.get('button').contains('Add a Friend').click();

    // Does friend chart pop-up when clicking on view
    cy.get('tr')
      .filter(':contains("David")')
      .within(() => {
        cy.get('button').contains('View').click();
        // cy.get('div[aria-label="Error"]', {timeout: 10000}).should('have.text','no record found')
      });
    cy.get('div[role="tooltip"]');
    cy.get('canvas', { timeout: 5000 }).should('be.visible');

    // Check to see if log-out exists and functions
    cy.get('.css-rpp4xf > .MuiBox-root').click();
    cy.get('ul[role = menu]').should('be.visible');
    cy.get('li[role = menuitem]').filter(':contains("Log Out")').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('logs in user using OAuth with GitHub', () => {
    cy.visit('http://localhost:3000/login');
    cy.get(
      '[href="http://localhost:4000/auth/github"] > .MuiButtonBase-root'
    ).click();

    cy.origin('https://github.com', () => {
      cy.get('input[name=login]').type(Cypress.env('GITHUB_EMAIL'));
      cy.get('input[name=password]').type(Cypress.env('GITHUB_PW'));
      cy.get('input[name=commit]').click();
      // <commands targeting https://github.com go here>
    });
  });
});

*/
