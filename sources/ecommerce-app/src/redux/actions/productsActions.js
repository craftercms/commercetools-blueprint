/*
 * MIT License
 *
 * Copyright (c) 2022 Crafter Software Corporation. All Rights Reserved.
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

export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const FETCH_PRODUCTS_COMPLETE = 'FETCH_PRODUCTS_COMPLETE';
export const FETCH_PRODUCTS_FAILED = 'FETCH_PRODUCTS_FAILED';

export const FETCH_PRODUCT = 'FETCH_PRODUCT';
export const FETCH_PRODUCT_COMPLETE = 'FETCH_PRODUCT_COMPLETE';
export const FETCH_PRODUCT_FAILED = 'FETCH_PRODUCT_FAILED';

export const FETCH_CART = 'FETCH_CART';
export const FETCH_CART_COMPLETE = 'FETCH_CART_COMPLETE';
export const FETCH_CART_FAILED = 'FETCH_CART_FAILED';

export const ADD_TO_CART = 'ADD_TO_CART';
export const ADD_TO_CART_COMPLETE = 'ADD_TO_CART_COMPLETE';
export const ADD_TO_CART_FAILED = 'ADD_TO_CART_FAILED';

export const UPDATE_CART = 'UPDATE_CART';
export const UPDATE_CART_COMPLETE = 'UPDATE_CART_COMPLETE';
export const UPDATE_CART_FAILED = 'UPDATE_CART_FAILED';

export const UPDATE_CART_ITEM_QUANTITY = 'UPDATE_CART_ITEM_QUANTITY';
export const UPDATE_CART_ITEM_QUANTITY_COMPLETE = 'UPDATE_CART_ITEM_QUANTITY_COMPLETE';
export const UPDATE_CART_ITEM_QUANTITY_FAILED = 'UPDATE_CART_ITEM_QUANTITY_FAILED';

export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const REMOVE_FROM_CART_COMPLETE = 'REMOVE_FROM_CART_COMPLETE';
export const REMOVE_FROM_CART_FAILED = 'REMOVE_FROM_CART_FAILED';

export const FACETS_CHANGED = 'FACETS_CHANGED';
export const KEYWORDS_CHANGED = 'KEYWORDS_CHANGED';

export const FETCH_SHIPPING_METHODS = '';
export const FETCH_SHIPPING_METHODS_COMPLETE = 'FETCH_SHIPPING_METHODS_COMPLETE';
export const FETCH_SHIPPING_METHODS_FAILED = 'FETCH_SHIPPING_METHODS_FAILED';

export const CHECKOUT = 'CHECKOUT';
export const CHECKOUT_COMPLETE = 'CHECKOUT_COMPLETE';
export const CHECKOUT_FAILED = 'CHECKOUT_FAILED';

export const CHANGE_LOCALE = 'CHANGE_LOCALE';
export const CHANGE_CURRENCY = 'CHANGE_CURRENCY';
export const SET_STORE_SETTINGS = 'SET_STORE_SETTINGS';

export function fetchProduct(id) {
  return {
    type: FETCH_PRODUCT,
    payload: { id }
  };
}

export function fetchProductComplete(response) {
  return {
    root: FETCH_PRODUCT,
    type: FETCH_PRODUCT_COMPLETE,
    payload: response
  };
}

export function fetchProductFailed(response) {
  return {
    root: FETCH_PRODUCT,
    type: FETCH_PRODUCT_FAILED,
    payload: response
  };
}

export function fetchProducts(query) {
  return {
    type: FETCH_PRODUCTS,
    payload: { query }
  };
}

export function fetchProductsComplete(response) {
  return {
    root: FETCH_PRODUCTS,
    type: FETCH_PRODUCTS_COMPLETE,
    payload: response
  };
}

export function fetchProductsFailed(response) {
  return {
    root: FETCH_PRODUCTS,
    type: FETCH_PRODUCTS_FAILED,
    payload: response
  };
}

export function fetchCart() {
  return {
    type: FETCH_CART
  };
}

export function fetchCartComplete(response) {
  return {
    root: FETCH_CART,
    type: FETCH_CART_COMPLETE,
    payload: response
  };
}

export function fetchCartFailed(response) {
  return {
    root: FETCH_CART,
    type: FETCH_CART_FAILED,
    payload: response
  };
}

export function addToCart(cartItem) {
  return {
    type: ADD_TO_CART,
    payload: cartItem
  };
}

export function addToCartComplete(response) {
  return {
    root: ADD_TO_CART,
    type: ADD_TO_CART_COMPLETE,
    payload: response
  };
}

export function addToCartFailed(response) {
  return {
    root: ADD_TO_CART,
    type: ADD_TO_CART_FAILED,
    payload: response
  };
}

export function removeFromCart(data) {
  return {
    type: REMOVE_FROM_CART,
    payload: data
  };
}

export function removeFromCartComplete(data) {
  return {
    root: REMOVE_FROM_CART,
    type: REMOVE_FROM_CART_COMPLETE,
    payload: data
  };
}

export function removeFromCartFailed(data) {
  return {
    root: REMOVE_FROM_CART,
    type: REMOVE_FROM_CART_FAILED,
    payload: data
  };
}

export function updateCartItemQuantity(data) {
  return {
    type: UPDATE_CART_ITEM_QUANTITY,
    payload: data
  };
}

export function updateCartItemQuantityComplete(data) {
  return {
    root: UPDATE_CART_ITEM_QUANTITY,
    type: UPDATE_CART_ITEM_QUANTITY_COMPLETE,
    payload: data
  };
}

export function updateCartItemQuantityFailed(data) {
  return {
    root: UPDATE_CART_ITEM_QUANTITY,
    type: UPDATE_CART_ITEM_QUANTITY_FAILED,
    payload: data
  };
}

export function updateCart(data) {
  return {
    type: UPDATE_CART,
    payload: data
  };
}

export function updateCartComplete(data) {
  return {
    root: UPDATE_CART,
    type: UPDATE_CART_COMPLETE,
    payload: data
  };
}

export function updateCartFailed(data) {
  return {
    root: UPDATE_CART,
    type: UPDATE_CART_FAILED,
    payload: data
  };
}

export function facetsChanged(query) {
  return {
    type: FACETS_CHANGED,
    payload: { query }
  };
}

export function keywordsChanged(keywords) {
  return {
    type: KEYWORDS_CHANGED,
    payload: { keywords }
  };
}

export function fetchShippingMethods() {
  return {
    type: FETCH_SHIPPING_METHODS
  };
}

export function fetchShippingMethodsComplete(data) {
  return {
    root: FETCH_SHIPPING_METHODS,
    type: FETCH_SHIPPING_METHODS_COMPLETE,
    payload: data
  };
}

export function fetchShippingMethodsFailed(data) {
  return {
    root: FETCH_SHIPPING_METHODS,
    type: FETCH_SHIPPING_METHODS_FAILED,
    payload: data
  };
}

export function checkout(data, redirect) {
  return {
    type: CHECKOUT,
    payload: { data, redirect }
  };
}

export function checkoutComplete(data) {
  return {
    root: CHECKOUT,
    type: CHECKOUT_COMPLETE,
    payload: data
  };
}

export function checkoutFailed(data) {
  return {
    root: CHECKOUT,
    type: CHECKOUT_FAILED,
    payload: data
  };
}

export function changeLocale(value) {
  return {
    type: CHANGE_LOCALE,
    payload: { value }
  };
}

export function changeCurrency(value) {
  return {
    type: CHANGE_CURRENCY,
    payload: { value }
  };
}

export function setStoreSettings(settings) {
  return {
    type: SET_STORE_SETTINGS,
    payload: settings
  }
}
