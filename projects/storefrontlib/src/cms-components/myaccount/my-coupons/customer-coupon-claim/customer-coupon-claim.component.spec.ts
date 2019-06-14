import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerCouponClaimComponent } from './customer-coupon-claim.component';
import {
  UserService,
  RoutingService,
  GlobalMessageService,
  PageContext,
  PageType,
  GlobalMessageType,
} from '@spartacus/core';
import { of } from 'rxjs';

const params = {
  ['couponCode']: 'customerCoupon1',
};

const context: PageContext = {
  id: 'couponClaim',
  type: PageType.CONTENT_PAGE,
};

const mockRouterState = {
  state: {
    cmsRequired: true,
    context,
    params,
  },
};

describe('CustomerCouponClaimComponent', () => {
  let component: CustomerCouponClaimComponent;
  let fixture: ComponentFixture<CustomerCouponClaimComponent>;

  const userService = jasmine.createSpyObj('UserService', [
    'getClaimCustomerCouponResultSuccess',
    'claimCustomerCoupon',
  ]);
  const routingService = jasmine.createSpyObj('RoutingService', [
    'getRouterState',
    'go',
  ]);
  const globalMessageService = jasmine.createSpyObj('GlobalMessageService', [
    'add',
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCouponClaimComponent],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: RoutingService, useValue: routingService },
        { provide: GlobalMessageService, useValue: globalMessageService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCouponClaimComponent);
    component = fixture.componentInstance;
  });

  it('components renders', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should add global message', () => {
      userService.getClaimCustomerCouponResultSuccess.and.returnValue(of(true));
      routingService.getRouterState.and.returnValue(of(mockRouterState));
      routingService.go.and.stub();
      component.ngOnInit();
      fixture.detectChanges();
      expect(globalMessageService.add).toHaveBeenCalledWith(
        { key: 'myCoupons.claimCustomerCoupon' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
      expect(routingService.go).toHaveBeenCalledWith('/my-account/coupons');
    });
  });
});
