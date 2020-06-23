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
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { CategoryListing } from './BlogRoll';
import { Link } from 'react-router-dom';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { useICE } from '../../util/component';
import { getProducts, useProductsQuery } from '../../util/products';

export default function BlogEntry(props) {
  const slug = props.match.params.slug;
  return <Layout
    requirements={[
      {
        name: 'categories',
        optional: true,
        getter: (content) => content.categories ? Object.values(content.categories.byId) : null
      },
      { name: 'post', getter: (content) => content.post && content.post.bySlug[slug] }
    ]}
    variables={{
      post: [
        { name: 'ageGroup', type: 'String', value: null },
        { name: 'gender', type: 'String', value: null },
        { name: 'slug', type: 'String', value: slug },
        { name: 'limit', type: 'Int', value: 1 }
      ]
    }}
    render={
      (reqs) => (
        <Container>
          <Row>
            <Col md={9}>
              <Card>
                <CardBody>
                  <Post post={reqs.post}/>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>

              <CategoryListing categories={reqs.categories}/>

              <RelatedPosts categories={reqs.post.categories_o.item} slug={slug}/>
              <RelatedProducts categories={reqs.post.categories_o.item}/>

            </Col>
          </Row>
        </Container>
      )
    }
  />;
}

function Post({ post }) {
  const { title_s, image_s, author_s, subtitle_s, content_html_raw, categories_o, localId } = post;
  const { props: ice } = useICE({ modelId: localId, label: `Blog Post: ${title_s}` });
  return (
    <>
      <section className="post__head" {...ice}>
        <h1 className="post__title">{title_s}</h1>
        {subtitle_s && <p className="post__subtitle">{subtitle_s}</p>}
        {author_s && <p className="post__author">By {author_s}</p>}
      </section>
      {image_s && <img className="post__image" src={image_s} alt=""/>}
      <div className="post__body" dangerouslySetInnerHTML={{ __html: content_html_raw }}/>
      <div className="post__categories">{categories_o.item.map((item) => item.value_smv).join(', ')}</div>
    </>
  );
}

function RelatedPosts({ categories, slug }) {
  const [relatedPosts, setRelatedPosts] = useState();
  useEffect(
    () => {
      ajax.post(
        process.env.REACT_APP_GRAPHQL_SERVER,
        {
          query: `query {
            posts: component_post (limit: 3, sortOrder: ASC, sortBy: "title_s") {
              items {
                title_s
                image_s
                slug_s(filter: { not: [{ equals: "${slug}" }]})
                categories_o @skip(if: true) {
                  item {
                    key(filter: {matches: "${categories[0].key}"})
                  }
                }
              }
            }
          }`
        },
        { 'Content-Type': 'application/json; charset=UTF-8' }
      ).pipe(
        map(({ response }) => (response.data.posts.items)),
        catchError((response) => of(response)),
      ).subscribe(posts => setRelatedPosts(posts));
    },
    [slug, categories]
  );
  return (
    relatedPosts ? <div className="blog__sidebar-bar-block">
      <h2 className="blog__side-bar-title">Related Posts</h2>
      <nav className="blog__side-bar-list">
        {
          relatedPosts.map(({ title_s, image_s, slug_s }) =>
            <Link key={slug_s} className="blog__side-bar-item" to={`/blog/${slug_s}`}>
              <img src={image_s} alt=""/>
              <h3 className="blog__related-post-title">{title_s}</h3>
            </Link>
          )
        }
      </nav>
    </div> : <></>
  );
}

function RelatedProducts({ categories }) {
  const [items, setItems] = useState();
  const params = useProductsQuery();
  useEffect(
    () => {
      getProducts({ limit: 3, offset: Math.floor(Math.random() * 11), ...params })
        .subscribe(({ response }) => setItems(response.items));
    },
    [categories[0].key, params.locale, params.currency]
  );
  return (
    items ? <div className="blog__sidebar-bar-block">
      <h2 className="blog__side-bar-title">Related Products</h2>
      <nav className="blog__side-bar-list">
        {
          items.map(({ id, variants, name }) =>
            <Link key={id} className="blog__side-bar-item blog__side-bar-item--horizontal" to={`/catalog/${id}`}>
              <img className="blog__side-bar-item-image" src={variants[0].images[0].url} alt=""/>
              <h3 className="blog__related-post-title">{name}</h3>
            </Link>
          )
        }
      </nav>
    </div> : <></>
  );
}
