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
  ADD_TO_CART,
  FETCH_CART,
  fetchCart,
  REMOVE_FROM_CART,
  UPDATE_CART,
  UPDATE_CART_ITEM_QUANTITY
} from '../redux/actions/productsActions';
import { useEffect, useRef } from 'react';
import { fetchOrder, setLoginRedirect } from '../redux/actions/usersActions';
import { SearchService } from '@craftercms/search';
import Cookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';

export function getLoginFormDefaults() {
  const email = localStorage.getItem(`${process.env.REACT_APP_STORE_KEY}.email`);
  return {
    email: email || '',
    rememberMe: email != null
  };
}

export function useCart({ onEmpty } = {}) {
  const ref = useRef({});
  ref.current = { onEmpty };
  const dispatch = useDispatch();
  const cart = useSelector(state => state.products.cart);
  const locale = useSelector(state => state.products).query.locale;
  const currency = useSelector(state => state.products).query.currency;
  useEffect(
    () => {
      if (cart && cart.items.length === 0) {
        if(ref.current.onEmpty) {
          ref.current.onEmpty();
        }
      }
    },
    [cart]
  );
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch, locale, currency])
  return cart;
}

export function useUser({ redirect, onMissing } = {}) {
  const ref = useRef({});
  ref.current = { redirect, onMissing };
  const dispatch = useDispatch();
  const user = useSelector(state => state.users.user);
  useEffect(
    () => {
      if (user == null) {
        if (ref.current.redirect) {
          dispatch(setLoginRedirect(ref.current.redirect));
        }
        if(ref.current.onMissing) {
          ref.current.onMissing();
        }
      }
    },
    [dispatch, user]
  );
  return user;
}

export function useUserBranch() {
  return useSelector(state => state.users);
}

export function useOrder(id) {
  const dispatch = useDispatch();
  const order = useSelector(state => state.users.orders[id]);
  useEffect(
    () => {
      if (id && (order == null || order.items == null))
        dispatch(fetchOrder(id));
    },
    [dispatch, id, order]
  );
  return order;
}

export function useProductsBranch() {
  return useSelector(state => state.products);
}

export function useContentBranch() {
  return useSelector(state => state.content);
}

export function useCartUpdateInFlight() {
  const { loading } = useSelector(state => state.products);
  return (
    loading[FETCH_CART] ||
    loading[UPDATE_CART] ||
    loading[ADD_TO_CART] ||
    loading[REMOVE_FROM_CART] ||
    loading[UPDATE_CART_ITEM_QUANTITY]
  );
}

export const crafterConf = {
  baseUrl: process.env.REACT_APP_CRAFTER_BASE,
  // By default empty on the .env so preview grabs the crafterSite cookie set by authoring
  // Dev may use it's .env.local for local development or fix the value.
  site: process.env.REACT_APP_SITE_ID || Cookie.get('crafterSite')
};

export function getQuery(query) {
  const crafterQuery = SearchService.createQuery();
  crafterQuery.query = {
    query: {
      bool: {
        filter: [
          { multi_match: { query, 'type': 'phrase_prefix' } },
          { match: { 'content-type': '/component/post' } }
        ]
      }
    }
  };
  return crafterQuery;
}
