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

import React, { useEffect, useRef } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import Layout from './Layout';
import {
  MultipleSelectionFacet,
  RangeFacet, SingleSelectionFacet,
} from './Facets';
import Spinner from '../shared/Spinner';
import Product from './Product';
import * as qs from 'query-string';
import { fetchProducts, FETCH_PRODUCTS } from '../../redux/actions/productsActions';
import Alert from '../shared/Alert';
import { Link } from 'react-router-dom';
import SearchIcon from 'mdi-react/SearchIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';

export default function ProductListing(props) {

  const dispatch = useDispatch();
  const { history } = props;
  const { byId, facets, query, loading, errors } = useSelector(state => state.products);
  const products = byId ? Object.values(byId) : null;
  const inputRef = useRef();

  const queryString = qs.parse(props.location.search);
  const facetMeta = { list: [], types: {}, state: {} };

  if (facets) {
    facets.forEach(({ type, value }) => {
      facetMeta.list.push(value);
      facetMeta.types[value] = type;
      switch (type) {
        case 'multiple':
          facetMeta.state[value] = [];
          break;
        case 'single':
          facetMeta.state[value] = '';
          break;
        case 'range':
          facetMeta.state[value] = null;
          break;
        default:
          break;
      }
    });
  }

  // Facets haven't loaded during the first render so can't rely
  // on facet type to do the proper URL decoding. Relying on inspection
  // for now.
  Object.entries(queryString).forEach(([key, value]) => {
    if (key === 'q') {
      key = 'keywords';
      facetMeta.state[key] = value;
    } else if (key === 'offset' || key === 'limit') {
      facetMeta.state[key] = value;
    } else {
      facetMeta.state[key] = (['rating', 'price'].includes(key))
        ? (
          value.split('-').reduce(
            (obj, value, index) => ({
              ...obj,
              ...{ [index === 0 ? 'min' : 'max']: parseInt(value) }
            }),
            {}
          )
        ) : (
          // This should catch both single and multiple all the same
          facetMeta.state[key] = value.split(',')
        );
    }
  });

  const fetch = () => {
    dispatch(fetchProducts(facetMeta.state));
  };

  // Adding facetMeta.state is creating a loop
  // eslint-disable-next-line
  useEffect(fetch, [history.location.search, query.locale, query.currency, dispatch]);

  useEffect(
    () => {
      (inputRef.current || { value: '' }).value = query.keywords;
    },
    [query.keywords]
  );

  function onRangeChange(which, value) {
    const newQS = [];

    queryString.q && newQS.push(`q=${queryString.q}`);
    Object.entries(queryString).forEach(([key, val]) => key !== which && newQS.push(`${key}=${val}`));
    newQS.push(`${which}=${value.join('-')}`);

    history.push(`/catalog${newQS.length ? `?${newQS.join('&')}` : ''}`);

  }

  function onMultipleValueChange(which, checked, { value }) {

    let collection = query[which] || [];
    if (checked) {
      collection = [...collection, value];
    } else {
      collection = collection.filter((_value) => _value !== value);
    }

    const newQS = [];

    queryString.q && newQS.push(`q=${queryString.q}`);
    Object.entries(queryString).forEach(([key, val]) => {
      if (key === 'offset') {
        newQS.push(`${key}=0`)
      } else if (key !== which)
        newQS.push(`${key}=${val}`)
    });
    (collection.length > 0) && newQS.push(`${which}=${collection.join(',')}`);

    history.push(`/catalog${newQS.length ? `?${newQS.join('&')}` : ''}`);

  }

  function onKeywordsChange(value) {
    const newQS = [];

    newQS.push(`q=${value || ''}`);
    queryString.price && newQS.push(`price=${queryString.price}`);
    queryString.rating && newQS.push(`rating=${queryString.rating}`);
    queryString.categories && newQS.push(`categories=${queryString.categories}`);
    queryString.colors && newQS.push(`colors=${queryString.colors}`);

    history.push(`/catalog${newQS.length ? `?${newQS.join('&')}` : ''}`);
  }

  function onOffsetChanged(nextPage) {
    const newQS = [];
    const nextPageIndex = nextPage - 1;

    const nextOffset = query.limit * nextPageIndex;

    (nextOffset != null) && newQS.push(`offset=${nextOffset}`);
    queryString.q && newQS.push(`q=${queryString.q}`);
    queryString.price && newQS.push(`price=${queryString.price}`);
    queryString.rating && newQS.push(`rating=${queryString.rating}`);
    queryString.categories && newQS.push(`categories=${queryString.categories}`);
    queryString.colors && newQS.push(`colors=${queryString.colors}`);

    history.push(`/catalog${newQS.length ? `?${newQS.join('&')}` : ''}`);
  }

  return (
    <Layout>
      <Container>
        {
          (errors[FETCH_PRODUCTS]) &&
          <Alert color="danger" className="alert--bordered" icon dismiss={false}>
            <span>
              An error has occurred trying to fetch products.
              <Button outline
                      onClick={fetch}
                      className="btn-retry btn-sm"
              >
                Retry
              </Button>
            </span>
          </Alert>
        }
        {
          (loading[FETCH_PRODUCTS]) &&
          <Spinner contained/>
        }
        {
          (loading[FETCH_PRODUCTS] === false) &&
          <>
            <Row>
              {
                facetMeta.state.keywords &&
                <Col md={12}>
                  <h2 className="page-title">Search results for "{facetMeta.state.keywords}"</h2>
                  <Link className="page-subhead" to="/catalog">(clear query)</Link>
                </Col>
              }
              <Col md={9}>
                <div className="catalog-items__wrap">
                  <div className="catalog-page-controls">
                    <ReactPaginate
                      containerClassName="pagination"
                      pageClassName="pagination__item"
                      pageLinkClassName="pagination__link"
                      previousClassName="pagination__item"
                      previousLinkClassName="pagination__link pagination__link--arrow"
                      nextClassName="pagination__item"
                      nextLinkClassName="pagination__link pagination__link--arrow"
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={3}
                      activeClassName="active"
                      initialPage={(query.offset / query.limit)}
                      pageCount={Math.ceil(query.total / query.limit)}
                      onPageChange={({ selected: index }) => onOffsetChanged(index + 1)}
                      disableInitialCallback={true}
                      previousLabel={<ChevronLeftIcon className="pagination__link-icon" />}
                      nextLabel={<ChevronRightIcon className="pagination__link-icon" />}
                    />
                  </div>
                  <div className="catalog-items">
                    {products.map(product =>
                      <Product key={product.id} product={product}/>
                    )}
                    {
                      (products.length === 0) && (
                        <Alert color="info" className="alert--bordered" icon dismiss={false}>
                          <span>No products to display (
                            <Link to="/catalog">clear filters</Link>
                          )</span>
                        </Alert>
                      )
                    }
                  </div>
                </div>
              </Col>
              <Col md={3}>

                <div className="form" style={{ background: 'white', marginBottom: 20, border: '1px solid #ddd' }}>
                  <div className="form__form-group-field">
                    <div className="form__form-group-icon">
                      <SearchIcon/>
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      name="keywords"
                      placeholder="Keywords..."
                      defaultValue={query.keywords}
                      onKeyPress={
                        (e) =>
                          e.key === 'Enter' &&
                          onKeywordsChange(e.target.value)
                      }
                    />
                  </div>
                </div>

                {
                  facets && facets.map((facet) => {
                    switch (facet.type) {
                      case 'single':
                      case 'multiple': {
                        const Component = facet.type === 'multiple'
                          ? MultipleSelectionFacet
                          : SingleSelectionFacet;
                        return <Component
                          key={facet.value}
                          title={facet.name}
                          checked={facetMeta.state[facet.value]}
                          onSelection={(checked, facetItem) => onMultipleValueChange(facet.value, checked, facetItem)}
                          facets={
                            facet.items.map((_facet_) => ({
                              value: _facet_.value,
                              label: _facet_.name
                            }))
                          }
                        />;
                      }
                      case 'range': {
                        return <RangeFacet
                          onChange={(value) => onRangeChange(facet.value, value)}
                          key={facet.value}
                          title={facet.name}
                          min={facet.min}
                          max={facet.max}
                          tipFormatter={facet.value === 'price' ? value => `$${value}` : value => value}
                          value={
                            facetMeta.state[facet.value]
                              ? [facetMeta.state[facet.value].min, facetMeta.state[facet.value].max]
                              : [facet.min, facet.max]
                          }
                        />;
                      }
                      default:
                        return null;
                    }
                  })
                }

              </Col>
            </Row>
          </>
        }
      </Container>
    </Layout>
  );
};
