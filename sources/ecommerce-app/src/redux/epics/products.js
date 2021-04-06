/*
 * MIT License
 *
 * Copyright (c) 2021 Crafter Software Corporation. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { ofType } from 'redux-observable';
import { mapTo, pluck, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import {
  ADD_TO_CART,
  addToCartComplete,
  addToCartFailed,
  CHECKOUT,
  checkoutComplete,
  checkoutFailed,
  FACETS_CHANGED,
  FETCH_CART,
  FETCH_PRODUCT,
  FETCH_PRODUCTS,
  FETCH_SHIPPING_METHODS,
  fetchCartComplete,
  fetchCartFailed,
  fetchProductComplete,
  fetchProductFailed,
  fetchProducts,
  fetchProductsComplete,
  fetchProductsFailed,
  fetchShippingMethodsComplete,
  fetchShippingMethodsFailed,
  REMOVE_FROM_CART,
  removeFromCartComplete,
  removeFromCartFailed,
  UPDATE_CART,
  UPDATE_CART_COMPLETE,
  UPDATE_CART_ITEM_QUANTITY,
  updateCartComplete,
  updateCartFailed,
  updateCartItemQuantityComplete,
  updateCartItemQuantityFailed
} from '../actions/productsActions';
import { errorOp, mapOp } from '../../util/redux';

export const fetchProductEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_PRODUCT),
  withLatestFrom(state$.pipe(pluck('products'))),
  switchMap(([{ payload }, state]) =>
    ajax
      .get(`/api/1/product/${payload.id}.json?locale=${state.query.locale}&currency=${state.query.currency}`)
      .pipe(errorOp)
  ),
  mapOp(fetchProductComplete, fetchProductFailed)
);

export const fetchProductsEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_PRODUCTS),
  withLatestFrom(state$.pipe(pluck('products'))),
  switchMap(([action, state]) => {
    const { query } = state;
    const qs = [];

    Object.entries(query).forEach(([key, value]) => {
      if (key !== 'total' && value != null && value !== '') {
        if (Array.isArray(value)) {
          (value.length > 0) && qs.push(`filter=${key}:${value.join(',')}`)
        } else if (typeof value === 'object') {
          qs.push(`filter=${key}:${value.min};${value.max}`);
        } else {
          qs.push(`${key}=${value}`);
        }
      }
    });

    return ajax
      .get(`/api/1/product/all.json?${qs.join('&')}`)
      .pipe(errorOp);
  }),
  mapOp(fetchProductsComplete, fetchProductsFailed)
);

export const fetchCartEpic = (action$) => action$.pipe(
  ofType(FETCH_CART),
  switchMap(() => ajax.get('/api/1/cart/current.json').pipe(errorOp)),
  mapOp(fetchCartComplete, fetchCartFailed)
);

export const addToCartEpic = (action$) => action$.pipe(
  ofType(ADD_TO_CART),
  switchMap(
    ({ payload }) => ajax.post(
      '/api/1/cart/item/add.json',
      payload,
      { 'Content-Type': 'application/json; charset=UTF-8' }
    ).pipe(errorOp)
  ),
  mapOp(addToCartComplete, addToCartFailed)
);

export const updateCartItemEpic = (action$) => action$.pipe(
  ofType(UPDATE_CART_ITEM_QUANTITY),
  switchMap(
    ({ payload }) => ajax.post(
      '/api/1/cart/item/change.json',
      { itemId: payload.id, quantity: payload.quantity },
      { 'Content-Type': 'application/json; charset=UTF-8' }
    ).pipe(errorOp)
  ),
  mapOp(updateCartItemQuantityComplete, updateCartItemQuantityFailed)
);

export const updateCartEpic = (action$) => action$.pipe(
  ofType(UPDATE_CART),
  switchMap(({ payload }) =>
    ajax.post(
      '/api/1/cart/update.json',
      payload,
      { 'Content-Type': 'application/json; charset=UTF-8' }
    ).pipe(errorOp)
  ),
  mapOp(updateCartComplete, updateCartFailed)
);

export const fetchShippingMethodsEpic = (action$) => action$.pipe(
  ofType(UPDATE_CART_COMPLETE, FETCH_SHIPPING_METHODS),
  switchMap(() =>
    ajax
      .get('/api/1/cart/shipping-methods.json')
      .pipe(errorOp)
  ),
  mapOp(fetchShippingMethodsComplete, fetchShippingMethodsFailed)
);

export const removeFromCartEpic = (action$) => action$.pipe(
  ofType(REMOVE_FROM_CART),
  switchMap(({ payload }) =>
    ajax.post(
      '/api/1/cart/item/change.json',
      { itemId: payload.id, quantity: 0 },
      { 'Content-Type': 'application/json; charset=UTF-8' }
    ).pipe(errorOp)
  ),
  mapOp(removeFromCartComplete, removeFromCartFailed)
);

export const facetsChangedEpic = (action$) => action$.pipe(
  ofType(FACETS_CHANGED),
  mapTo(fetchProducts())
);

export const checkoutEpic = (action$) => action$.pipe(
  ofType(CHECKOUT),
  switchMap(({ payload }) => ajax
    .post(
      `/api/1/cart/checkout.json`,
      payload.data.card,
      { 'Content-Type': 'application/json; charset=UTF-8' }
    )
    .pipe(
      tap(({ response }) => payload.redirect(`/account/orders/${response.id}`)),
      errorOp
    )
  ),
  mapOp(checkoutComplete, checkoutFailed)
);
