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

export const CHANGE_THEME_TO_DARK = 'CHANGE_THEME_TO_DARK';
export const CHANGE_THEME_TO_LIGHT = 'CHANGE_THEME_TO_LIGHT';
export const SET_IS_AUTHORING = 'SET_IS_AUTHORING';
export const CHANGE_BORDER_RADIUS = 'CHANGE_BORDER_RADIUS';
export const TOGGLE_BOX_SHADOW = 'TOGGLE_BOX_SHADOW';
export const TOGGLE_TOP_NAVIGATION = 'TOGGLE_TOP_NAVIGATION';

export function changeThemeToDark() {
  return {
    type: CHANGE_THEME_TO_DARK,
  };
}

export function changeThemeToLight() {
  return {
    type: CHANGE_THEME_TO_LIGHT,
  };
}

export function setIsAuthoring(isAuthoring) {
  return {
    type: SET_IS_AUTHORING,
    payload: { isAuthoring }
  };
}

export function changeBorderRadius() {
  return {
    type: CHANGE_BORDER_RADIUS,
  };
}

export function toggleBoxShadow() {
  return {
    type: TOGGLE_BOX_SHADOW,
  };
}

export function toggleTopNavigation() {
  return {
    type: TOGGLE_TOP_NAVIGATION,
  };
}
