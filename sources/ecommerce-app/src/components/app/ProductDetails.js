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

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import Layout from './Layout';
import ProductCard from './ProductCard';
import Spinner from '../shared/Spinner';
import { fetchProduct } from '../../redux/actions/productsActions';
import Product from './Product';
import { forkJoin, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { BlogPostCard } from './BlogTeaser';

export default function ProductDetails(props) {

  const dispatch = useDispatch();
  const products = useSelector(state => state.products);

  const id = props.match.params.product;
  const product = products.byId ? products.byId[id] : null;
  const [related, setRelated] = useState();

  useEffect(
    () => {
      if (product == null)
        dispatch(fetchProduct(id))
    },
    [id]
  );

  useEffect(
    () => {
      let sub = { unsubscribe: () => void null };
      if (product != null) {

        const keys = product.categories.reduce(
          (oMap, category) => {
            oMap.ids.push(category.id);
            oMap.keys.push(`{matches: "${category.key}"}`);
            return oMap;
          },
          { ids: [], keys: [] }
        );

        const products$ = keys.ids.length
          ? ajax.get(`/api/1/product/all.json?limit=4&locale=en_us&filter=categories:${keys.ids.join(',')}`)
          : of({ response: { items: [] } });

        const posts$ = keys.keys.length
          ? ajax.post(
            process.env.REACT_APP_GRAPHQL_SERVER,
            {
              query: `query {
              posts: component_post(limit: 3) {
                items {
                  title_s
                  image_s
                  slug_s
                  categories_o @skip(if: true) {
                    item {
                      key(filter: {or: [${keys.keys.join(',')}]})
                    }
                  }
                }
              }
            }`,
              variables: {}
            },
            { 'Content-Type': 'application/json; charset=UTF-8' }
          ) : of({ response: { data: { posts: { items: [] } } } });

        sub = forkJoin(products$, posts$).pipe(
          map(([{ response: products }, { response: posts }]) => ([
            products.items.filter((prod) => prod.id !== product.id).slice(0, 3),
            posts.data.posts.items
          ]))
        ).subscribe(([products, posts]) => {
          setRelated({ products, posts });
        });

      }
      return () => sub.unsubscribe();
    },
    [product ? product.id : undefined]
  );

  return (
    <Layout>
      <Container>
        {
          product ? (
            <Row>
              <Col md={12} lg={12}>
                <ProductCard product={product}/>
              </Col>
              {related && <>
                {related.products.length > 0 && <Col md={12}>
                  <h2 className="page-title page-title--not-last">Related Products</h2>
                  <div className="catalog-items__wrap">
                    <div className="catalog-items">
                      {
                        related.products.map(product =>
                          <Product key={product.id} product={product}/>
                        )
                      }
                    </div>
                  </div>
                </Col>}
                {related.posts.length > 0 && <Col md={12}>
                  <h2 className="page-title page-title--not-last">Related Posts</h2>
                  <Row>
                    {
                      related.posts.map((post) =>
                        <Col key={post.slug_s} md={4}>
                          <BlogPostCard {...post} hideSummary/>
                        </Col>
                      )
                    }
                  </Row>
                </Col>}
              </>}
            </Row>
          ) : <Spinner/>
        }
      </Container>
    </Layout>
  );

}
