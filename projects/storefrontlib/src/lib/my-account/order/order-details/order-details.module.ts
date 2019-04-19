import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsConfig, ConfigModule, I18nModule } from '@spartacus/core';
import { OrderDetailHeadlineComponent } from './order-detail-headline/order-detail-headline.component';
import { OrderDetailItemsComponent } from './order-detail-items/order-detail-items.component';
import { OrderDetailTotalsComponent } from './order-detail-totals/order-detail-totals.component';
import { OrderDetailShippingComponent } from './order-detail-shipping/order-detail-shipping.component';
import { CartSharedModule } from '../../../cart/cart-shared/cart-shared.module';
import { CardModule } from '../../../ui/components/card/card.module';
import { OrderDetailsService } from './order-details.service';
import { TrackingEventsComponent } from './order-detail-items/consignment-tracking/tracking-events.component';
import { SpinnerModule } from '../../../ui/components/spinner/spinner.module';

const moduleComponents = [
  OrderDetailHeadlineComponent,
  OrderDetailItemsComponent,
  OrderDetailTotalsComponent,
  OrderDetailShippingComponent,
];

@NgModule({
  imports: [
    CartSharedModule,
    CardModule,
    CommonModule,
    I18nModule,
    SpinnerModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        AccountOrderDetailsHeadlineComponent: {
          selector: 'cx-order-details-headline',
        },
        AccountOrderDetailsItemsComponent: {
          selector: 'cx-order-details-items',
        },
        AccountOrderDetailsTotalsComponent: {
          selector: 'cx-order-details-totals',
        },
        AccountOrderDetailsShippingComponent: {
          selector: 'cx-order-details-shipping',
        },
      },
    }),
  ],
  providers: [OrderDetailsService],
  declarations: [...moduleComponents, TrackingEventsComponent],
  exports: [...moduleComponents],
  entryComponents: [...moduleComponents, TrackingEventsComponent],
})
export class OrderDetailsModule {}
