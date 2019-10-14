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

import React, { useEffect } from 'react';
import Spinner from './Spinner';
import Alert from './Alert';
import { Col, Container, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { FETCH_GRAPH, fetchGraph } from '../../redux/actions/contentActions';
import { useContentBranch } from '../../util/component';
import { byIdLoadingKey } from '../../util/redux';

export function AssertContent(props) {

  const {
    render,
    children,
    variables,
    requirements
  } = props;

  const content = useContentBranch();
  const dispatch = useDispatch();

  const reqs = {};
  const required = [];
  const optional = [];

  requirements.forEach((req) => {

    const isDescriptor = typeof req === 'object';

    const name = isDescriptor ? req.name : req;
    const checker = isDescriptor && req.getter ? req.getter : (content) => content[req];
    const isOptional = isDescriptor && req.optional;
    const value = checker(content);

    if (value == null) {
      (isOptional ? optional : required).push(name);
    }

    reqs[name] = value;

  });

  useEffect(
    () => {
      const toBeFetched = [...required, ...optional].filter(
        (req) => content.loading[byIdLoadingKey(FETCH_GRAPH, req)] !== true
      );
      if (toBeFetched.length) {
        const vars = [];
        toBeFetched.forEach((req) =>
          variables &&
          variables[req] &&
          variables[req].forEach((r) => vars.push(r))
        );
        dispatch(fetchGraph(
          toBeFetched,
          vars
        ));
      }
    }
  );

  if (content.errors[FETCH_GRAPH]) {
    try {
      content.errors[FETCH_GRAPH].forEach((error) => {
        console.error(error.message);
      });
    } catch (e) {

    }
    return (
      <aside className="landing__section">
        <Container>
          <Row>
            <Col sm={12} style={{ padding: '50px' }}>
              <Alert color="danger" className="alert--neutral" icon dismiss={false}>
                <p>An error occurred fetching site content.</p>
              </Alert>
            </Col>
          </Row>
        </Container>
      </aside>
    );
  }

  if (required.length > 0) {
    return <Spinner/>;
  } else {
    return (render)
      ? render(reqs)
      : React.Children.map(children, (child) => {
        return React.cloneElement(child, reqs)
      });
  }

}

export default AssertContent;
