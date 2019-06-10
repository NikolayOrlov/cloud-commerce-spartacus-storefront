import { TestBed } from '@angular/core/testing';

import { Store, StoreModule, select } from '@ngrx/store';

import { StateWithUser, USER_FEATURE } from '../user-state';
import * as fromActions from '../actions/index';
import * as fromReducers from '../reducers/index';
import * as fromSelectors from '../selectors/index';
import { LoaderState } from '../../../state/utils/loader/loader-state';
import {
  CustomerCoupon,
  CustomerCouponSearchResult,
} from '../../../model/customer-coupon.model';
const coupon: CustomerCoupon = {
  couponId: 'coupon',
  name: 'coupon',
  startDate: new Date(),
  endDate: new Date(),
  status: 'Effective',
  description: '',
  notificationOn: true,
  solrFacets: '',
};

const customerSearcherResult: CustomerCouponSearchResult = {
  coupons: [coupon],
  pagination: {
    count: 1,
    page: 4,
    totalCount: 11,
    totalPages: 5,
  },
  sorts: [],
};

const emptyCustomerSearcherResult: CustomerCouponSearchResult = {
  coupons: [],
  pagination: {},
  sorts: [],
};

describe('Customer Coupon Selectors', () => {
  let store: Store<StateWithUser>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(USER_FEATURE, fromReducers.getReducers()),
      ],
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getCustomerCouponsState', () => {
    it('should return customer coupon state', () => {
      let result: LoaderState<CustomerCouponSearchResult>;
      store
        .pipe(select(fromSelectors.getCustomerCouponsState))
        .subscribe(value => (result = value))
        .unsubscribe();

      expect(result).toEqual({
        loading: false,
        error: false,
        success: false,
        value: emptyCustomerSearcherResult,
      });
    });
  });

  describe('getCustomerCoupons', () => {
    it('should return customer coupons', () => {
      let result: CustomerCouponSearchResult;
      store
        .pipe(select(fromSelectors.getCustomerCoupons))
        .subscribe(value => (result = value));

      expect(result).toEqual(emptyCustomerSearcherResult);

      store.dispatch(
        new fromActions.LoadCustomerCouponsSuccess(customerSearcherResult)
      );
      expect(result).toEqual(customerSearcherResult);
    });
  });

  describe('getCustomerCouponsLoaded', () => {
    it('should return success flag of orders state', () => {
      let result: boolean;
      store
        .pipe(select(fromSelectors.getCustomerCouponsLoaded))
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(
        new fromActions.LoadCustomerCouponsSuccess(customerSearcherResult)
      );
      expect(result).toEqual(true);
    });
  });
});
