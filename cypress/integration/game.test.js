/* global cy:true describe:true it:true */

describe('Game Tests', () => {
  it('should load the game', () => {
    cy.visit('/');
    cy.get('body');
  });

  it('should allow the user to click the attack button, rewarding a kill', () => {
    cy.visit('/');
    cy.wait(10000);
    cy.get('.attack-button')
      .click();
    cy.get('.total-kills')
      .should('contain', '1.0');
  });

  it('should allow the user to recruit a unit when they can afford it', () => {
    cy.visit('/');
    cy.wait(10000);
    cy.get('.attack-button')
      .click()
      .click()
      .click()
      .click()
      .click()
      .click()
      .click()
      .click()
      .click()
      .click()
      .click()
      .click()
      .click()
      .click()
      .click();
    cy.get('.recruit--add ')
      .click();
    cy.wait(2000);
    cy.get('.recruit__total')
      .should('contain', 1);
  });
});
