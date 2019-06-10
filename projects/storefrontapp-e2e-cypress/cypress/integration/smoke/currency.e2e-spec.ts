import * as siteContextSelector from '../../helpers/site-context-selector';
import { switchSiteContext } from '../../support/utils/switch-site-context';

context('Currency change', () => {
  const productPath = siteContextSelector.PRODUCT_PATH_1;

  beforeEach(() => {
    cy.server();
    siteContextSelector.createGerericQuery(
      siteContextSelector.CURRENCY_REQUEST,
      siteContextSelector.CURRENCIES
    );
  });

  describe('on the product page', () => {
    it('should change the currency and be persistent in the url ', () => {
      siteContextSelector.verifyCurrencyChange(productPath);
    });

    it('should display the chosen currency', () => {
      siteContextSelector.currencyChange(productPath);

      cy.get('.price').should('contain', '¥690');
      switchSiteContext(siteContextSelector.CURRENCY_USD, 'Currency');
      cy.get('.price').should('contain', '$8.20');
    });
  });

  describe('on the login page', () => {
    const LOGIN_URL_USD = `/${
      siteContextSelector.CONTENT_CATALOG
    }/en/USD/login`;
    const TEST_EMAIL = 'my@email.com';

    it('user input should not be removed on currency change', () => {
      cy.visit(`${LOGIN_URL_USD}`);
      cy.get('input[type="email"]').type(TEST_EMAIL);
      cy.wait('@currencies');

      switchSiteContext(siteContextSelector.CURRENCY_JPY, 'Currency');

      cy.get('input[type="email"]').should('have.value', TEST_EMAIL);
    });
  });
});
