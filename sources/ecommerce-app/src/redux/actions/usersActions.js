/*
 * MIT License
 *
 * Copyright (c) 2019 Crafter Software Corporation. All Rights Reserved.
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

export const LOGIN = 'LOGIN';
export const LOGIN_COMPLETE = 'LOGIN_COMPLETE';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const SET_PERSONA = 'SET_PERSONA';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_COMPLETE = 'LOGOUT_COMPLETE';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';

export const REGISTRATION_COMPLETE = 'REGISTRATION_COMPLETE';
export const SUBMIT_REGISTRATION = 'SUBMIT_REGISTRATION';
export const SUBMIT_REGISTRATION_COMPLETE = 'SUBMIT_REGISTRATION_COMPLETE';
export const SUBMIT_REGISTRATION_FAILED = 'SUBMIT_REGISTRATION_FAILED';

export const FETCH_ORDERS = 'FETCH_ORDERS';
export const FETCH_ORDERS_COMPLETE = 'FETCH_ORDERS_COMPLETE';
export const FETCH_ORDERS_FAILED = 'FETCH_ORDERS_FAILED';

export const FETCH_ORDER = 'FETCH_ORDER';
export const FETCH_ORDER_COMPLETE = 'FETCH_ORDER_COMPLETE';
export const FETCH_ORDER_FAILED = 'FETCH_ORDER_FAILED';

export const UNAUTHORIZED = 'UNAUTHORIZED';

export const SET_LOGIN_REDIRECT = 'SET_LOGIN_REDIRECT';
export const RESET_LOGIN_REDIRECT = 'RESET_LOGIN_REDIRECT';

export const ADD_USER_ADDRESS = 'ADD_USER_ADDRESS';
export const ADD_USER_ADDRESS_COMPLETE = 'ADD_USER_ADDRESS_COMPLETE';
export const ADD_USER_ADDRESS_FAILED = 'ADD_USER_ADDRESS_FAILED';

export const EDIT_USER_ADDRESS = 'EDIT_USER_ADDRESS';
export const EDIT_USER_ADDRESS_COMPLETE = 'EDIT_USER_ADDRESS_COMPLETE';
export const EDIT_USER_ADDRESS_FAILED = 'EDIT_USER_ADDRESS_FAILED';

export const REMOVE_USER_ADDRESS = 'REMOVE_USER_ADDRESS';
export const REMOVE_USER_ADDRESS_COMPLETE = 'REMOVE_USER_ADDRESS_COMPLETE';
export const REMOVE_USER_ADDRESS_FAILED = 'REMOVE_USER_ADDRESS_FAILED';

export const SET_USER_ADDRESS_DEFAULTS = 'SET_USER_ADDRESS_DEFAULTS';
export const SET_USER_ADDRESS_DEFAULTS_COMPLETE = 'SET_USER_ADDRESS_DEFAULTS_COMPLETE';
export const SET_USER_ADDRESS_DEFAULTS_FAILED = 'SET_USER_ADDRESS_DEFAULTS_FAILED';

export function submitRegistration() {
  return {
    type: SUBMIT_REGISTRATION
  };
}

export function submitRegistrationComplete() {
  return {
    root: SUBMIT_REGISTRATION,
    type: SUBMIT_REGISTRATION_COMPLETE
  };
}

export function submitRegistrationFailed(message) {
  return {
    root: SUBMIT_REGISTRATION,
    type: SUBMIT_REGISTRATION_FAILED,
    payload: message
  };
}

export function registrationComplete() {
  return {
    type: REGISTRATION_COMPLETE
  };
}

export function login(data, redirect) {
  return {
    type: LOGIN,
    payload: { data, redirect }
  };
}

export function loginComplete(user) {
  return {
    root: LOGIN,
    type: LOGIN_COMPLETE,
    payload: user
  };
}

export const setPersona = (persona) => ({
  type: SET_PERSONA,
  payload: { persona }
});

export function loginFailed(response) {
  return {
    root: LOGIN,
    type: LOGIN_FAILED,
    payload: response
  };
}

export function logout(redirect) {
  return {
    type: LOGOUT,
    payload: { redirect }
  };
}

export function logoutComplete() {
  return {
    root: LOGOUT,
    type: LOGOUT_COMPLETE
  };
}

export function logoutFailed() {
  return {
    root: LOGOUT,
    type: LOGOUT_FAILED
  };
}

export function fetchOrders() {
  return {
    type: FETCH_ORDERS,
    payload: null
  };
}

export function fetchOrdersComplete(response) {
  return {
    root: FETCH_ORDERS,
    type: FETCH_ORDERS_COMPLETE,
    payload: response
  };
}

export function fetchOrdersFailed(response) {
  return {
    root: FETCH_ORDERS,
    type: FETCH_ORDERS_FAILED,
    payload: response
  };
}

export function fetchOrder(id) {
  return {
    type: FETCH_ORDER,
    payload: { id }
  };
}

export function fetchOrderComplete(response) {
  return {
    root: FETCH_ORDER,
    type: FETCH_ORDER_COMPLETE,
    payload: response
  };
}

export function fetchOrderFailed(response) {
  return {
    root: FETCH_ORDER,
    type: FETCH_ORDER_FAILED,
    payload: response
  };
}

export function setLoginRedirect(url) {
  return {
    type: SET_LOGIN_REDIRECT,
    payload: { url }
  };
}

export function resetLoginRedirect() {
  return {
    type: RESET_LOGIN_REDIRECT
  };
}

export function addAddress(address) {
  return {
    type: ADD_USER_ADDRESS,
    payload: { address }
  };
}

export function addAddressComplete(response) {
  return {
    root: ADD_USER_ADDRESS,
    type: ADD_USER_ADDRESS_COMPLETE,
    payload: response
  };
}

export function addAddressFailed(response) {
  return {
    root: ADD_USER_ADDRESS,
    type: ADD_USER_ADDRESS_FAILED,
    payload: response
  };
}

export function editAddress(address) {
  return {
    type: EDIT_USER_ADDRESS,
    payload: { address }
  };
}

export function editAddressComplete(response) {
  return {
    root: EDIT_USER_ADDRESS,
    type: EDIT_USER_ADDRESS_COMPLETE,
    payload: response
  };
}

export function editAddressFailed(response) {
  return {
    root: EDIT_USER_ADDRESS,
    type: EDIT_USER_ADDRESS_FAILED,
    payload: response
  };
}

export function removeAddress(id) {
  return {
    type: REMOVE_USER_ADDRESS,
    payload: { id }
  };
}

export function removeAddressComplete(response) {
  return {
    root: REMOVE_USER_ADDRESS,
    type: REMOVE_USER_ADDRESS_COMPLETE,
    payload: response
  };
}

export function removeAddressFailed(response) {
  return {
    root: REMOVE_USER_ADDRESS,
    type: REMOVE_USER_ADDRESS_FAILED,
    payload: response
  };
}

export function setAddressDefaults(address) {
  return {
    type: SET_USER_ADDRESS_DEFAULTS,
    payload: { address }
  };
}

export function setAddressDefaultsComplete(response) {
  return {
    root: SET_USER_ADDRESS_DEFAULTS,
    type: SET_USER_ADDRESS_DEFAULTS_COMPLETE,
    payload: response
  };
}

export function setAddressDefaultsFailed(response) {
  return {
    root: SET_USER_ADDRESS_DEFAULTS,
    type: SET_USER_ADDRESS_DEFAULTS_FAILED,
    payload: response
  };
}
