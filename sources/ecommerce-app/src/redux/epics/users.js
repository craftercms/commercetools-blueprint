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

import { ofType } from 'redux-observable';
import {
  LOGIN,
  LOGOUT,
  FETCH_ORDERS,
  UNAUTHORIZED,
  SUBMIT_REGISTRATION,
  fetchOrdersComplete,
  fetchOrdersFailed,
  loginComplete,
  loginFailed,
  logoutComplete,
  logoutFailed,
  submitRegistrationComplete,
  submitRegistrationFailed,
  ADD_USER_ADDRESS,
  addAddressComplete,
  addAddressFailed,
  EDIT_USER_ADDRESS,
  editAddressComplete,
  editAddressFailed,
  REMOVE_USER_ADDRESS,
  removeAddressFailed,
  removeAddressComplete,
  SET_USER_ADDRESS_DEFAULTS,
  setAddressDefaultsComplete,
  setAddressDefaultsFailed,
  FETCH_ORDER,
  fetchOrderFailed,
  fetchOrderComplete
} from '../actions/usersActions';
import { catchError, ignoreElements, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { errorOp, mapOp } from '../../util/redux';

export function submitRegistrationEpic(action$, state$) {
  return action$.pipe(
    ofType(SUBMIT_REGISTRATION),
    switchMap(() => {
      const data = state$.value.form.registration.values;
      return ajax.post(
        `/api/1/customer/signup.json`,
        data,
        {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      ).pipe(
        catchError((error) => [error])
      );
    }),
    map((response) => {
      if (response.name === 'AjaxError') {
        return submitRegistrationFailed(response);
      } else {
        return submitRegistrationComplete(response.response);
      }
    })
  );
}

export const loginEpic = (action$, state$) => action$.pipe(
  ofType(LOGIN),
  switchMap(({ payload }) => ajax
    .post(
      `/api/1/security/login.json`,
      payload.data,
      { 'Content-Type': 'application/json; charset=UTF-8' }
    ).pipe(
      tap(() => setTimeout(() =>
        payload.redirect &&
        payload.redirect(state$.value.users.loginRedirect)
      )),
      errorOp
    )
  ),
  mapOp(loginComplete, loginFailed)
);

export const logoutEpic = (action$) => action$.pipe(
  ofType(LOGOUT),
  switchMap(({ payload }) =>
    ajax
      .post(`/api/1/security/logout.json`)
      .pipe(
        withLatestFrom([payload.redirect]),
        errorOp
      )
  ),
  map(([response, redirect]) => {
    if (response.name === 'AjaxError') {
      return logoutFailed(response);
    } else {
      redirect('/');
      return logoutComplete(response.response);
    }
  })
);

export const unauthorizedEpic = (action$) => action$.pipe(
  ofType(UNAUTHORIZED),
  tap(({ payload }) => payload.redirect('/login')),
  ignoreElements()
);

export const fetchOrdersEpic = (action$) => action$.pipe(
  ofType(FETCH_ORDERS),
  switchMap(() => ajax
    .get(`/api/1/customer/orders.json`)
    .pipe(errorOp)
  ),
  map((response) =>
    (response.name === 'AjaxError')
      ? fetchOrdersFailed(response)
      : fetchOrdersComplete(response.response)
  )
);

export const fetchOrderEpic = (action$) => action$.pipe(
  ofType(FETCH_ORDER),
  switchMap(({ payload }) => ajax
    .get(`/api/1/customer/orders/${payload.id}.json`)
    .pipe(errorOp)
  ),
  mapOp(fetchOrderComplete, fetchOrderFailed)
);

export const addUserAddressEpic = (action$) => action$.pipe(
  ofType(ADD_USER_ADDRESS),
  switchMap(({ payload }) => ajax
    .post(
      `/api/1/customer/update.json`,
      { addAddress: [payload.address] },
      { 'Content-Type': 'application/json; charset=UTF-8' }
    ).pipe(errorOp)
  ),
  mapOp(addAddressComplete, addAddressFailed)
);

export const editUserAddressEpic = (action$) => action$.pipe(
  ofType(EDIT_USER_ADDRESS),
  switchMap(({ payload }) => ajax
    .post(
      `/api/1/customer/update.json`,
      { changeAddress: [payload.address] },
      { 'Content-Type': 'application/json; charset=UTF-8' }
    ).pipe(errorOp)
  ),
  mapOp(editAddressComplete, editAddressFailed)
);

export const removeUserAddressEpic = (action$) => action$.pipe(
  ofType(REMOVE_USER_ADDRESS),
  switchMap(({ payload }) => ajax
    .post(
      `/api/1/customer/update.json`,
      { removeAddress: [{ id: payload.id }] },
      { 'Content-Type': 'application/json; charset=UTF-8' }
    ).pipe(errorOp)
  ),
  mapOp(removeAddressComplete, removeAddressFailed)
);

export const setAsDefaultAddressEpic = (action$) => action$.pipe(
  ofType(SET_USER_ADDRESS_DEFAULTS),
  switchMap(({ payload }) => ajax
    .post(
      `/api/1/customer/update.json`,
      {
        ...payload.address.isBillingDefault ? { defaultBillingAddress: payload.address.id } : {},
        ...payload.address.isShippingDefault ? { defaultShippingAddress: payload.address.id } : {}
      },
      { 'Content-Type': 'application/json; charset=UTF-8' }
    )
  ),
  mapOp(setAddressDefaultsComplete, setAddressDefaultsFailed)
);
