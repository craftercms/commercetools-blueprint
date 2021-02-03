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

import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { createEpicMiddleware } from 'redux-observable';
import {
  themeReducer,
  contentReducer,
  usersReducer,
  productsReducer
} from './reducers';

import rootEpic from './epics/epics';
import { loginComplete, setPersona } from './actions/usersActions';
import { setIsAuthoring } from './actions/themeActions';
import { setStoreSettings } from './actions/productsActions';
import React, { createContext, useContext, useMemo } from 'react';
import { createDispatchHook, createSelectorHook, createStoreHook } from 'react-redux';
import Subscription from 'react-redux/lib/utils/Subscription';

const reducer = combineReducers({
  form: reduxFormReducer,
  theme: themeReducer,
  content: contentReducer,
  users: usersReducer,
  products: productsReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware();

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(epicMiddleware)
  )
);

const json = document.getElementById('userJSON').innerHTML;
try {
  const user = JSON.parse(json);
  user && store.dispatch(loginComplete(user));
} catch (e) {
  (process.env.NODE_ENV === 'development') && console.error('Invalid syntax for user JSON.', e.message);
}

let persona = null;
try {
  const json = document.getElementById('personaJSON').innerHTML;
  persona = JSON.parse(json);
  persona && store.dispatch(setPersona(persona))
} catch (e) {
  (process.env.NODE_ENV === 'development') && console.error('Invalid syntax for persona JSON.', e.message);
}

let storeSettings = null;
try {
  const json = document.getElementById('storeSettingsJSON').innerHTML;
  storeSettings = JSON.parse(json);
  storeSettings && store.dispatch(setStoreSettings(storeSettings));
} catch (e) {
  (process.env.NODE_ENV === 'development') && console.error('Invalid syntax for store settings JSON.', e.message);
}

// True if the site is being view via authoring (studio).
// False if it's the live site.
const isAuthoring = ['true']
  .includes(
    document
      .querySelector('html')
      .getAttribute('data-craftercms-preview')
  );

if (isAuthoring) {
  store.dispatch(setIsAuthoring(isAuthoring));
}

epicMiddleware.run(rootEpic);

const AppStoreContext = createContext();

export function useAppStoreContext() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error(`useGlobalContext must be used within a GlobalContextProvider`);
  }
  return context;
}

export function AppStoreContextProvider(props) {
  const value = useMemo(function () {
    var subscription = new Subscription(store);
    subscription.onStateChange = subscription.notifyNestedSubs;
    return {
      store: store,
      subscription: subscription
    };
  }, [store]);

  return <AppStoreContext.Provider value={value} {...props} />;
}

export const useAppStore = createStoreHook(AppStoreContext);
export const useAppSelector = createSelectorHook(AppStoreContext);
export const useAppDispatch = createDispatchHook(AppStoreContext);

export default store;
