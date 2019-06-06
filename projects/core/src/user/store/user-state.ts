import { Address, Country, Region } from '../../model/address.model';
import { PaymentDetails } from '../../model/cart.model';
import { Title, User } from '../../model/misc.model';
import { Order, OrderHistoryList } from '../../model/order.model';
import { LoaderState } from '../../state';
import { ConsentTemplate } from '../../model/consent.model';
import {CustomerCouponSearchResult} from '../../model/customer-coupon.model';

export const USER_FEATURE = 'user';
export const UPDATE_EMAIL_PROCESS_ID = 'updateEmail';
export const UPDATE_PASSWORD_PROCESS_ID = 'updatePassword';
export const UPDATE_USER_DETAILS_PROCESS_ID = 'updateUserDetails';
export const REMOVE_USER_PROCESS_ID = 'removeUser';
export const GIVE_CONSENT_PROCESS_ID = 'giveConsent';
export const WITHDRAW_CONSENT_PROCESS_ID = 'withdrawConsent';

export const USER_CONSENTS = '[User] User Consents';
export const USER_PAYMENT_METHODS = '[User] User Payment Methods';
export const USER_ORDERS = '[User] User Orders';
export const USER_ADDRESSES = '[User] User Addresses';

export const CUSTOMER_COUPONS = '[User] Customer Coupons';
export const SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID = 'subscribeCustomerCoupon';
export const UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID = 'unsubscribeCustomerCoupon';

export interface StateWithUser {
  [USER_FEATURE]: UserState;
}

export interface UserState {
  account: UserDetailsState;
  addresses: LoaderState<Address[]>;
  consents: LoaderState<ConsentTemplate[]>;
  billingCountries: BillingCountriesState;
  countries: DeliveryCountriesState;
  payments: LoaderState<PaymentDetails[]>;
  orders: LoaderState<OrderHistoryList>;
  order: OrderDetailsState;
  titles: TitlesState;
  regions: RegionsState;
  resetPassword: boolean;
  customerCoupons: LoaderState<CustomerCouponSearchResult>;
}

export interface OrderDetailsState {
  order: Order;
}

export interface RegionsState {
  entities: Region[];
}

export interface BillingCountryEntities {
  [key: string]: Country;
}

export interface BillingCountriesState {
  entities: BillingCountryEntities;
}

export interface DeliveryCountryEntities {
  [key: string]: Country;
}

export interface DeliveryCountriesState {
  entities: DeliveryCountryEntities;
}

export interface TitleEntities {
  [key: string]: Title;
}

export interface TitlesState {
  entities: TitleEntities;
}

export interface UserDetailsState {
  details: User;
}
