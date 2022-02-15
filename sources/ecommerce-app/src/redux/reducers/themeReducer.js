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

import {
  CHANGE_THEME_TO_DARK,
  CHANGE_THEME_TO_LIGHT,
  SET_IS_AUTHORING,
  CHANGE_BORDER_RADIUS,
  TOGGLE_BOX_SHADOW,
  TOGGLE_TOP_NAVIGATION
} from '../actions/themeActions';

const initialState = {
  isAuthoring: false,
  className: 'theme-light',
  squaredCorners: false,
  withBoxShadow: false,
  topNavigation: false,
};

function themeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_THEME_TO_DARK:
      return { ...state, className: 'theme-dark' };
    case CHANGE_THEME_TO_LIGHT:
      return { ...state, className: 'theme-light' };
    case SET_IS_AUTHORING:
      return { ...state, isAuthoring: action.payload.isAuthoring };
    case CHANGE_BORDER_RADIUS:
      return { ...state, squaredCorners: !state.squaredCorners };
    case TOGGLE_BOX_SHADOW:
      return { ...state, withBoxShadow: !state.withBoxShadow };
    case TOGGLE_TOP_NAVIGATION:
      return { ...state, topNavigation: !state.topNavigation };
    default:
      return state;
  }
}

export default themeReducer;

