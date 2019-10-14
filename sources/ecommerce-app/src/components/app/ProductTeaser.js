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

/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Container,
} from 'reactstrap';
import { useICE } from '../../util/component';
import { ajax } from 'rxjs/ajax';
import Product from './Product';
import { switchMap, map } from 'rxjs/operators';

window.test = (offset, limit) => {
  return ajax.get(`/api/1/product/all.json?limit=${limit}&locale=en_us&offset=${offset}`)
};

export default function ProductTeaser(props) {

  const {
    label,
    localId,
    title_s,
    numOfProducts_i = 3
  } = props;

  const { props: ice } = useICE({ modelId: localId, label });
  const [products, setProducts] = useState();

  useEffect(
    () => {
      // Probe for total number of catalog items
      ajax.get(`/api/1/product/all.json?limit=${numOfProducts_i}&locale=en_us&offset=0`)
        .pipe(
          switchMap(({ response: { total, items } }) => {
            if (total === 0 || total <= numOfProducts_i) {
              return items;
            } else {
              // Get a few products from the catalog based on numOfProducts_i &
              const offset = Math.ceil(Math.random() * total) - numOfProducts_i;
              return ajax.get(`/api/1/product/all.json?limit=${numOfProducts_i}&locale=en_us&offset=${offset}`).pipe(
                map(({ response: { items } }) => items)
              );
            }
          })
        ).subscribe(items => setProducts(items));
    },
    []
  );

  return (
    <section className="landing__section" {...ice}>
      <Container>
        <Row>
          <Col md={12}>
            <h3 className="landing__section-title">{title_s}</h3>
          </Col>
        </Row>
        <Row className="landing__teasers">
          {
            products && products.map((product) =>
              <Product key={product.id} product={product}/>
            )
          }
          {
            products && products.length === 0 && <strong style={{
              display:'block',
              textAlign:'center',
              width: '100%'
            }}>
              No products on the catalog yet. Please check back later!
            </strong>
          }
        </Row>
      </Container>
    </section>
  );
}

