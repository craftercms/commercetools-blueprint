/*
 * Copyright (C) 2007-2021 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { isAuthoring } from './utils';
import { useSpreadState } from './hooks';

export const GlobalContext = createContext();

function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(`useGlobalContext must be used within a GlobalContextProvider`);
  }
  return context;
}

function GlobalContextProvider(props) {
  const [state, setState] = useSpreadState({
    isAuthoring: isAuthoring(),
    locale: 'en',
    pages: null,
    pagesLoading: false,
    theme: 'light',
    $: props.jQuery
  });
  const value = useMemo(() => [state, setState], [state, setState]);
  return <GlobalContext.Provider value={value} {...props} />;
}

export { GlobalContextProvider, useGlobalContext };
