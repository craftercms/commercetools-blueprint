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
import Layout from './Layout';
import { Badge, Card, CardBody, Col, Container, Row } from 'reactstrap';
import * as qs from 'query-string';

import { SearchService } from '@craftercms/search';

import MagnifyIcon from 'mdi-react/MagnifyIcon';
import { Empty } from '../shared/Empty';
import { ajax } from 'rxjs/ajax';
import { Link } from 'react-router-dom';
import { capitalize } from '../../util/string';
import { crafterConf, getQuery } from '../../util/component';
import { getProducts, useProductsQuery } from '../../util/products';

const
  ARTICLE = 'ARTICLE',
  PRODUCT = 'PRODUCT';

export default function Search(props) {

  const { q: query } = { q: '', ...qs.parse(props.location.search) };
  const [value, setValue] = useState(query);

  const [productResults, setProductResults] = useState();
  const [contentResults, setContentResults] = useState();

  const productsQueryParams = useProductsQuery({ q: query, limit: 10, offset: 10 });

  useEffect(
    () => {
      if (query) {

        SearchService.search(getQuery(query), crafterConf).subscribe((content) => {
          setContentResults({
            total: content.totalHits,
            articles: content.hits.map(item => item.sourceAsMap)
          });
        });

        getProducts(productsQueryParams).subscribe(({ response: catalog }) => {
          setProductResults({
            total: catalog.total,
            products: catalog.items
          });
        });

        setValue(query);

      }
    },
    [query, productsQueryParams.locale, productsQueryParams.currency]
  );

  return (
    <Layout>
      <Container>
        <Row>
          <Col md={9}>
            <Card>
              <CardBody>
                <div className="card__title">
                  <h1 className="bold-text">Search</h1>
                </div>
                <form
                  className="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    props.history.push(`/search?q=${value}`);
                  }}
                >
                  <div className="form__form-group">
                    <div className="form__form-group-field">
                      <input name="q" type="text" placeholder="Search..." value={value}
                             onChange={(e) => setValue(e.target.value)}/>
                      <button className="form__form-group-icon">
                        <MagnifyIcon/>
                      </button>
                    </div>
                  </div>
                </form>
                {
                  !query &&
                  <Empty description="Please enter your search query to perform a search."/>
                }
                {
                  contentResults && <>
                    <h4>{`Search result for "${query}"`}</h4>
                    <p className="subhead">Found {contentResults.total} results.</p>
                    <div>
                      {
                        contentResults.total === 0
                          ? <Empty description="No results where found for your query."/>
                          : contentResults.articles.map((item) =>
                            <SearchResult
                              key={item.objectId}
                              type={ARTICLE}
                              item={item}
                            />
                          )
                      }
                    </div>
                  </>
                }
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            {
              productResults ?
                productResults.total === 0
                  ? 'No products matched your search'
                  : <>
                    <p className="subhead">Products related to your search.</p>
                    <div>
                      {
                        productResults.products.map((item) => <SearchResult
                          key={item.id}
                          type={PRODUCT}
                          item={item}
                        />)
                      }
                    </div>
                  </>
                : null
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export function SearchResult(props) {
  const { type, item } = props;
  const
    title = item[type === ARTICLE ? 'title_s' : 'name'],
    link = type === ARTICLE ? `/blog/${item.slug_s}` : `/catalog/${item.id}`,
    preview = type === PRODUCT ? item.description : item.content_html.substr(0, 100),
    img = type === PRODUCT ? item.variants[0].images[0].url : item.image_s;
  return (
    <div className="search-result">
      <Link to={link}>
        <img className="search-result__img" src={img} alt=""/>
      </Link>
      <div className="search-result__content">
        <Link className="search-result__title" to={link}>{title}</Link>
        {type === PRODUCT ? null : <p className="search-result__preview">{preview}</p>}
        <Badge color="info">{capitalize(type.toLowerCase())}</Badge>
      </div>
    </div>
  );
}
