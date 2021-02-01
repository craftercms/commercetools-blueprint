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

import {
  ADD_USER_ADDRESS,
  ADD_USER_ADDRESS_COMPLETE,
  ADD_USER_ADDRESS_FAILED,
  EDIT_USER_ADDRESS,
  EDIT_USER_ADDRESS_COMPLETE,
  EDIT_USER_ADDRESS_FAILED, FETCH_ORDER, FETCH_ORDER_COMPLETE, FETCH_ORDER_FAILED,
  FETCH_ORDERS,
  FETCH_ORDERS_COMPLETE,
  FETCH_ORDERS_FAILED, LOGIN,
  LOGIN_COMPLETE,
  LOGIN_FAILED,
  LOGOUT_COMPLETE, REGISTRATION_COMPLETE,
  REMOVE_USER_ADDRESS,
  REMOVE_USER_ADDRESS_COMPLETE,
  REMOVE_USER_ADDRESS_FAILED,
  RESET_LOGIN_REDIRECT,
  SET_LOGIN_REDIRECT, SET_PERSONA,
  SET_USER_ADDRESS_DEFAULTS,
  SET_USER_ADDRESS_DEFAULTS_COMPLETE,
  SET_USER_ADDRESS_DEFAULTS_FAILED,
  SUBMIT_REGISTRATION_FAILED
} from '../actions/usersActions';
import { getRootType, removeProp } from '../../util/redux';
import { CHECKOUT_COMPLETE } from '../actions/productsActions';
import { toLookupTable } from '../../util/array';

const initialState = {
  loading: {},
  errors: {},
  user: null,
  orders: {},
  persona: null,
  loginRedirect: '/account',
  registerConfirmPending: false
};

export default function usersReducer(state = initialState, action) {
  let { root, type, payload } = action;
  if (!root) root = getRootType(type);
  switch (type) {

    case SET_PERSONA:
      return {
        ...state,
        persona: payload.persona
      };

    case LOGIN:
    case FETCH_ORDER:
    case FETCH_ORDERS:
    case ADD_USER_ADDRESS:
    case EDIT_USER_ADDRESS:
    case REMOVE_USER_ADDRESS:
    case SET_USER_ADDRESS_DEFAULTS:
      return {
        ...state,
        errors: removeProp(state.errors, type),
        loading: {
          ...state.loading,
          [type]: true
        }
      };

    case CHECKOUT_COMPLETE:
    case FETCH_ORDER_COMPLETE:
      return {
        ...state,
        orders: {
          ...state.orders,
          [payload.id]: payload
        }
      };

    case LOGIN_COMPLETE:
    case ADD_USER_ADDRESS_COMPLETE:
    case EDIT_USER_ADDRESS_COMPLETE:
    case REMOVE_USER_ADDRESS_COMPLETE:
    case SET_USER_ADDRESS_DEFAULTS_COMPLETE:
      return {
        ...state,
        persona: payload.attributes,
        user: payload,
        loading: {
          ...state.loading,
          [root]: false
        }
      };

    case FETCH_ORDERS_COMPLETE:
      return {
        ...state,
        errors: removeProp(state.errors, FETCH_ORDERS),
        loading: {
          ...state.loading,
          [FETCH_ORDERS]: false
        },
        orders: toLookupTable(payload.items)
      };

    case LOGOUT_COMPLETE:
      return {
        ...state,
        user: null
      };

    case LOGIN_FAILED:
    case FETCH_ORDER_FAILED:
    case ADD_USER_ADDRESS_FAILED:
    case EDIT_USER_ADDRESS_FAILED:
    case REMOVE_USER_ADDRESS_FAILED:
    case SET_USER_ADDRESS_DEFAULTS_FAILED:
      return {
        ...state,
        loading: {
          ...state.loading,
          [root]: false
        },
        errors: {
          [root]: payload.message
        }
      };

    case SUBMIT_REGISTRATION_FAILED:
      return {
        ...state,
        errors: {
          registration: payload.response.message
        }
      };
    case FETCH_ORDERS_FAILED:
      return payload.status === 403 ? {
        ...state,
        user: null
      } : state;

    case SET_LOGIN_REDIRECT:
      return {
        ...state,
        loginRedirect: payload.url
      };
    case RESET_LOGIN_REDIRECT:
      return {
        ...state,
        loginRedirect: initialState.loginRedirect
      };

    case REGISTRATION_COMPLETE:
      return {
        ...state,
        registerConfirmPending: true
      };

    default:
      return state;
  }
}
