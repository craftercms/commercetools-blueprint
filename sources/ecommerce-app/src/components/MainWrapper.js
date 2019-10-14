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

import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

function MainWrapper(props) {
  const { theme, children } = props;

  const wrapperClass = classNames({
    'wrapper': true,
    'squared-corner-theme': theme.squaredCorners,
    'blocks-with-shadow-theme': theme.withBoxShadow,
    'top-navigation': theme.topNavigation,
  });

  return (
    <div className={theme.className}>
      <div className={wrapperClass}>
        {children}
      </div>
    </div>
  );
}

export default connect(state => ({
  theme: state.theme,
  customizer: state.customizer,
}))(MainWrapper);
