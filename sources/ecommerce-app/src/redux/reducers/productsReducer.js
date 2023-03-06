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

import { LOGIN_COMPLETE } from '../actions/usersActions';
import {
  ADD_TO_CART,
  ADD_TO_CART_COMPLETE,
  ADD_TO_CART_FAILED,
  CHANGE_CURRENCY,
  CHANGE_LOCALE,
  CHECKOUT_COMPLETE,
  FACETS_CHANGED,
  FETCH_CART_COMPLETE,
  FETCH_PRODUCT,
  FETCH_PRODUCT_COMPLETE,
  FETCH_PRODUCT_FAILED,
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_COMPLETE,
  FETCH_PRODUCTS_FAILED,
  FETCH_SHIPPING_METHODS,
  FETCH_SHIPPING_METHODS_COMPLETE,
  FETCH_SHIPPING_METHODS_FAILED,
  KEYWORDS_CHANGED, REMOVE_FROM_CART,
  REMOVE_FROM_CART_COMPLETE, SET_STORE_SETTINGS,
  UPDATE_CART,
  UPDATE_CART_COMPLETE, UPDATE_CART_FAILED, UPDATE_CART_ITEM_QUANTITY,
  UPDATE_CART_ITEM_QUANTITY_COMPLETE, UPDATE_CART_ITEM_QUANTITY_FAILED
} from '../actions/productsActions';
import { toLookupTable } from '../../util/array';
import { byIdLoadingKey, getRootType, removeProp } from '../../util/redux';

const initialState = {
  byId: null,
  cart: null,
  facets: [],
  loading: {},
  errors: {},
  query: {
    offset: 0,
    limit: 10,
    locale: 'en',
    currency: 'USD'
  }
};

export default function productReducer(state = initialState, action) {
  let { root, type, payload } = action;
  if (root == null) root = getRootType(type);
  switch (type) {

    case ADD_TO_CART:
    case UPDATE_CART:
    case REMOVE_FROM_CART:
    case UPDATE_CART_ITEM_QUANTITY:
      return {
        ...state,
        errors: removeProp(state.errors, type),
        loading: {
          ...state.loading,
          [type]: true
        }
      };

    case CHECKOUT_COMPLETE:
      return {
        ...state,
        cart: null
      };

    case FETCH_PRODUCTS:
      return {
        ...state,
        errors: removeProp(state.errors, FETCH_PRODUCTS),
        loading: {
          ...state.loading,
          [FETCH_PRODUCTS]: true
        },
        query: payload.query
          ? {
            ...state.query,
            ...payload.query
          }
          : state.query
      };

    case FETCH_PRODUCTS_COMPLETE:
      return {
        ...state,
        loading: {
          ...state.loading,
          [FETCH_PRODUCTS]: false
        },
        query: {
          ...state.query,
          total: payload.total
        },
        byId: toLookupTable(payload.items),
        facets: payload.facets
      };

    case CHANGE_LOCALE:
    case CHANGE_CURRENCY: {
      return {
        ...state,
        query: {
          ...state.query,
          [type === CHANGE_LOCALE ? 'locale' : 'currency']: payload.value
        }
      }
    }

    case SET_STORE_SETTINGS: {
      return {
        ...state,
        query: {
          ...state.query,
          ...payload
        }
      }
    }

    case FETCH_PRODUCT:
      return {
        ...state,
        errors: removeProp(state.errors, FETCH_PRODUCT),
        loading: {
          ...state.loading,
          [byIdLoadingKey(root, payload.id)]: true
        }
      };

    case FETCH_PRODUCT_COMPLETE:
      return {
        ...state,
        loading: {
          ...state.loading,
          [byIdLoadingKey(root, payload.item.id)]: false
        },
        byId: {
          ...state.byId,
          [payload.item.id]: payload.item
        }
      };

    case LOGIN_COMPLETE:
      return payload.cart ? {
        ...state,
        cart: payload.cart
      } : state;

    case FETCH_CART_COMPLETE:
    case UPDATE_CART_COMPLETE:
    case ADD_TO_CART_COMPLETE:
    case REMOVE_FROM_CART_COMPLETE:
    case UPDATE_CART_ITEM_QUANTITY_COMPLETE:
      return {
        ...state,
        cart: payload,
        loading: {
          ...state.loading,
          [root]: false
        }
      };

    case FACETS_CHANGED:
      return {
        ...state,
        query: {
          ...state.query,
          ...payload.query
        }
      };

    case KEYWORDS_CHANGED:
      return {
        ...state,
        query: {
          ...state.query,
          keywords: payload.keywords
        }
      };

    case FETCH_SHIPPING_METHODS:
      return {
        ...state,
        errors: removeProp(state.errors, FETCH_SHIPPING_METHODS),
        loading: {
          ...state.loading,
          [FETCH_SHIPPING_METHODS]: true
        }
      };

    case FETCH_SHIPPING_METHODS_COMPLETE:
      return {
        ...state,
        shippingMethods: payload,
        loading: {
          ...state.loading,
          [FETCH_SHIPPING_METHODS]: false
        }
      };


    case ADD_TO_CART_FAILED:
    case UPDATE_CART_FAILED:
    case FETCH_PRODUCT_FAILED:
    case FETCH_PRODUCTS_FAILED:
    case FETCH_SHIPPING_METHODS_FAILED:
    case UPDATE_CART_ITEM_QUANTITY_FAILED:
      return {
        ...state,
        errors: {
          ...state.errors,
          [root]: payload.message || payload.response.message
        },
        loading: {
          ...state.loading,
          [root]: false
        }
      };

    default:
      return state;
  }
}
