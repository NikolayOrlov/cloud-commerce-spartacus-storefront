import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService, UserToken } from '../../auth/index';
import { Cart } from '../../model/cart.model';
import { OrderEntry } from '../../model/order.model';
import * as fromProcessStore from '../../process/store/process-state';
import {
  getProcessErrorFactory,
  getProcessSuccessFactory,
} from '../../process/store/selectors/process.selectors';
import { BaseSiteService } from '../../site-context/index';
import * as fromAction from '../store/actions';
import { ADD_VOUCHER_PROCESS_ID, StateWithCart } from '../store/cart-state';
import * as fromSelector from '../store/selectors';
import { ANONYMOUS_USERID, CartDataService } from './cart-data.service';

@Injectable()
export class CartService {
  private callback: Function;

  constructor(
    protected store: Store<
      StateWithCart | fromProcessStore.StateWithProcess<void>
    >,
    protected cartData: CartDataService,
    protected authService: AuthService,
    protected baseSiteService: BaseSiteService
  ) {
    this.init();
  }

  getActive(): Observable<Cart> {
    return this.store.pipe(select(fromSelector.getCartContent));
  }

  getEntries(): Observable<OrderEntry[]> {
    return this.store.pipe(select(fromSelector.getEntries));
  }

  getCartMergeComplete(): Observable<boolean> {
    return this.store.pipe(select(fromSelector.getCartMergeComplete));
  }

  getLoaded(): Observable<boolean> {
    return this.store.pipe(select(fromSelector.getLoaded));
  }

  protected init(): void {
    this.store.pipe(select(fromSelector.getCartContent)).subscribe(cart => {
      this.cartData.cart = cart;
      if (this.callback) {
        this.callback();
        this.callback = null;
      }
    });

    combineLatest([
      this.baseSiteService.getActive(),
      this.authService.getUserToken(),
    ])
      .pipe(
        filter(([, userToken]) => this.cartData.userId !== userToken.userId)
      )
      .subscribe(([, userToken]) => {
        this.setUserId(userToken);
        this.loadOrMerge();
      });

    this.refresh();
  }

  protected setUserId(userToken: UserToken): void {
    if (Object.keys(userToken).length !== 0) {
      this.cartData.userId = userToken.userId;
    } else {
      this.cartData.userId = ANONYMOUS_USERID;
    }
  }

  protected loadOrMerge(): void {
    this.cartData.getDetails = true;
    // for login user, whenever there's an existing cart, we will load the user
    // current cart and merge it into the existing cart
    if (this.cartData.userId !== ANONYMOUS_USERID) {
      if (!this.isCreated(this.cartData.cart)) {
        this.store.dispatch(
          new fromAction.LoadCart({
            userId: this.cartData.userId,
            cartId: 'current',
          })
        );
      } else {
        this.store.dispatch(
          new fromAction.MergeCart({
            userId: this.cartData.userId,
            cartId: this.cartData.cart.guid,
          })
        );
      }
    }
  }

  protected refresh(): void {
    this.store.pipe(select(fromSelector.getRefresh)).subscribe(refresh => {
      if (refresh) {
        this.store.dispatch(
          new fromAction.LoadCart({
            userId: this.cartData.userId,
            cartId: this.cartData.cartId,
            details: true,
          })
        );
      }
    });
  }

  loadDetails(): void {
    this.cartData.getDetails = true;

    if (this.cartData.userId !== ANONYMOUS_USERID) {
      this.store.dispatch(
        new fromAction.LoadCart({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId ? this.cartData.cartId : 'current',
          details: true,
        })
      );
    } else if (this.cartData.cartId) {
      this.store.dispatch(
        new fromAction.LoadCart({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          details: true,
        })
      );
    }
  }

  addEntry(productCode: string, quantity: number): void {
    if (!this.isCreated(this.cartData.cart)) {
      this.store.dispatch(
        new fromAction.CreateCart({ userId: this.cartData.userId })
      );
      this.callback = function() {
        this.store.dispatch(
          new fromAction.AddEntry({
            userId: this.cartData.userId,
            cartId: this.cartData.cartId,
            productCode: productCode,
            quantity: quantity,
          })
        );
      };
    } else {
      this.store.dispatch(
        new fromAction.AddEntry({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          productCode: productCode,
          quantity: quantity,
        })
      );
    }
  }

  removeEntry(entry: OrderEntry): void {
    this.store.dispatch(
      new fromAction.RemoveEntry({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        entry: entry.entryNumber,
      })
    );
  }

  updateEntry(entryNumber: string, quantity: number): void {
    if (+quantity > 0) {
      this.store.dispatch(
        new fromAction.UpdateEntry({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          entry: entryNumber,
          qty: quantity,
        })
      );
    } else {
      this.store.dispatch(
        new fromAction.RemoveEntry({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          entry: entryNumber,
        })
      );
    }
  }

  getEntry(productCode: string): Observable<OrderEntry> {
    return this.store.pipe(
      select(fromSelector.getEntrySelectorFactory(productCode))
    );
  }

  isCreated(cart: Cart): boolean {
    return cart && !!Object.keys(cart).length;
  }

  isEmpty(cart: Cart): boolean {
    return cart && !cart.totalItems;
  }

  addVoucher(voucherId: string): void {
    this.store.dispatch(
      new fromAction.AddCartVoucher({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        voucherId: voucherId,
      })
    );
  }

  removeVoucher(voucherId: string): void {
    this.store.dispatch(
      new fromAction.RemoveCartVoucher({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        voucherId: voucherId,
      })
    );
  }

  getAddVoucherResultError(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessErrorFactory(ADD_VOUCHER_PROCESS_ID))
    );
  }

  getAddVoucherResultSuccess(): Observable<boolean> {
    return this.store.pipe(
      select(getProcessSuccessFactory(ADD_VOUCHER_PROCESS_ID))
    );
  }
}
