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

import React from 'react';

// import invariant from 'tiny-invariant';
import hoistStatics from 'hoist-non-react-statics';

import { useHistory, useLocation } from 'react-router-dom';
import { useUser } from '../../util/component';
import Spinner from './Spinner';

export default function authorized(Component) {

  const displayName = `authorized(${Component.displayName || Component.name})`;
  const C = props => {

    const history = useHistory();
    const location = useLocation;
    const { wrappedComponentRef, ...remainingProps } = props;

    const user = useUser({
      redirect: location.pathname,
      onMissing: () => setTimeout(() => history.push('/login'))
    });

    if (user)
      return (
        <Component
          {...remainingProps}
          ref={wrappedComponentRef}
          user={user}
        />
      );
    else
      return null;

  };

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return hoistStatics(C, Component);

}

export function awaitRequirements(Component, { requirements, onMissing }) {

  const displayName = `awaitRequirements(${Component.displayName || Component.name})`;
  const C = props => {

    const { wrappedComponentRef, ...remainingProps } = props;

    const reqs = {};
    const missing = [];
    Object.entries(requirements).forEach(([key, getter]) => {
      reqs[key] = getter();
      if (reqs[key] == null) {
        missing.push(key);
      }
    });

    onMissing && onMissing(missing);

    if (missing.length > 0) {
      return <Spinner/>;
    } else {
      return (
        <Component
          ref={wrappedComponentRef}
          {...remainingProps}
          {...reqs}
        />
      );
    }

  };

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return hoistStatics(C, Component);

}

// Example
// export default awaitRequirements(LogIn, {
//   ['onMissing']: (reqs) => {
//     const dispatch = useDispatch();
//     useEffect(
//       () => {
//         if (reqs.length)
//           dispatch(fetchGraph(['header']));
//       },
//       []
//     );
//   },
//   requirements: {
//     ['header']: () => useHeader()
//   }
// });
