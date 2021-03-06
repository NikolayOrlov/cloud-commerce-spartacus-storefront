import * as checkout from '../../helpers/checkout-flow';
import { user } from '../../sample-data/checkout-flow';
import { Address } from '../../helpers/checkout-forms';

const usaAddress: Address = {
  city: 'Los Angeles',
  line1: '340 Main Street',
  line2: '',
  country: 'United States',
  postal: '90291',
  state: 'California',
};

const canadaAddress: Address = {
  city: 'Montreal',
  line1: '111 Boulevard Robert-Bourassa',
  line2: '',
  country: 'Canada',
  postal: '9000',
  state: 'Quebec',
};

const polandAddress: Address = {
  city: 'Wrocław',
  line1: 'Dmowskiego 17',
  line2: '',
  country: 'Poland',
  postal: '50-203',
};

context('Payment billing address', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.visit('/');
  });

  it('should go to checkout', () => {
    checkout.registerUser();
    checkout.signOutUser();
    checkout.goToProductDetailsPage();
    checkout.addProductToCart();
    checkout.loginUser();
  });

  it('should fill address form', () => {
    checkout.fillAddressForm();
  });

  it('should choose delivery', () => {
    checkout.chooseDeliveryMethod();
  });

  it('should fill in payment form with billing address same as shipping address', () => {
    checkout.fillPaymentForm();
  });

  it('should redirect to review order page', () => {
    checkout.verifyReviewOrderPage();
  });

  it('should go to payment details', () => {
    checkout.goToPaymentDetails();
  });

  it('should open add new payment form', () => {
    checkout.clickAddNewPayment();
  });

  it('should fill in payment form with different billing address (same country)', () => {
    checkout.fillPaymentForm(user, {
      ...user,
      address: usaAddress,
    });
  });

  it('should redirect to review order page', () => {
    checkout.verifyReviewOrderPage();
  });
  it('should go to payment details', () => {
    checkout.goToPaymentDetails();
  });

  it('should open add new payment form', () => {
    checkout.clickAddNewPayment();
  });

  it('should fill in payment form with different billing address (country with states)', () => {
    checkout.fillPaymentForm(user, { ...user, address: canadaAddress });
  });

  it('should redirect to review order page', () => {
    checkout.verifyReviewOrderPage();
  });

  it('should go to payment details', () => {
    checkout.goToPaymentDetails();
  });

  it('should open add new payment form', () => {
    checkout.clickAddNewPayment();
  });

  it('should fill in payment form with different billing address (country without states)', () => {
    checkout.fillPaymentForm(user, {
      ...user,
      address: polandAddress,
    });
  });

  it('should redirect to review order page', () => {
    checkout.verifyReviewOrderPage();
  });
});
