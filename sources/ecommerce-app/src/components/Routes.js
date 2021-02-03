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

import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import ProductDetails from './app/ProductDetails';

import LogIn from './app/LogIn';
import Register from './app/Register';
import NotFound404 from './app/NotFoundView';
import CartView from './app/CartView';
import Account from './app/Account';
import CheckoutView from './app/CheckoutView';
import { AddressEntry } from './app/AddressCard';
import OrderDetails from './app/OrderDetails';
import BlogEntry from './app/BlogEntry';
import Search from './app/Search';
import { useHistory } from 'react-router-dom';
import DynamicRoute from './shared/DynamicRoute';
import { useAppSelector } from '../redux/store';

const Routes = () => {

  const history = useHistory();
  const { isAuthoring } = useAppSelector(state => state.theme);

  useEffect(
    () => {
      if (isAuthoring) {
        return history.listen((location) => {
          window.require &&
          window.require(['guest'], (guest) => {
            guest.reportNavigation(location, location.pathname);
          });
        });
      }
    },
    [history, isAuthoring]
  );

  return (
    <Switch>
      <Route exact path="/" component={DynamicRoute} />
      <Route exact path="/catalog" component={DynamicRoute}/>
      <Route path="/catalog/:product" component={ProductDetails}/>
      <Route path="/cart" component={CartView}/>
      <Route path="/checkout" component={CheckoutView}/>
      <Route exact path="/account/address-book/new" component={AddressEntry}/>
      <Route exact path="/account/address-book/edit/:id?" component={AddressEntry}/>
      <Route exact path="/account/orders/:id" component={OrderDetails}/>
      <Route path="/account/:tab?" component={Account}/>
      <Route exact path="/blog" component={DynamicRoute}/>
      <Route path="/blog/:slug" component={BlogEntry}/>
      <Route path="/login" component={LogIn}/>
      <Route path="/register" component={Register}/>
      <Route path="/search" component={Search}/>
      <Route path="/" component={NotFound404}/>
    </Switch>
  );
};

export default Routes;
