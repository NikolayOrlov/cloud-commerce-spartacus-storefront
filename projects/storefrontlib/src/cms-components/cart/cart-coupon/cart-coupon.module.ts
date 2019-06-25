import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@spartacus/core';
import { IconModule } from '../../../cms-components/misc/icon/index';
import { AppliedCouponsComponent } from './applied-coupons/applied-coupons.component';
import { CartCouponAnchorComponent } from './cart-coupon-anchor/cart-coupon-anchor.component';
import { CartCouponComponent } from './cart-coupon.component';

@NgModule({
  declarations: [
    CartCouponComponent,
    AppliedCouponsComponent,
    CartCouponAnchorComponent,
  ],
  exports: [
    CartCouponComponent,
    AppliedCouponsComponent,
    CartCouponAnchorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    RouterModule,
    IconModule,
  ],
})
export class CartCouponModule {}
