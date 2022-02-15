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

import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { Container, Row, Col, Card } from 'reactstrap';
import { useContentBranch } from '../../util/component';
import { loader } from 'graphql.macro';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { BlogPostCard } from './BlogTeaser';
import Spinner from '../shared/Spinner';
import { Empty } from '../shared/Empty';
import * as qs from 'query-string';
import KeyboardArrowLeftIcon from 'mdi-react/KeyboardArrowLeftIcon';
import { Link } from 'react-router-dom';

const query = loader('../../queries/Blog.graphql').loc.source.body;

export default function BlogRoll(props) {

  const content = useContentBranch();
  const [roll, setRoll] = useState();
  const selectedCategory = qs.parse(props.location.search).category;

  useEffect(
    () => {
      let sub = { unsubscribe: () => void null };
      if (!!content.nav) {
        const navItem = content.nav.find(item => props.location.pathname === item.url);
        sub = ajax.post(
          process.env.REACT_APP_GRAPHQL_SERVER,
          { query, variables: { id: navItem.localId } },
          { 'Content-Type': 'application/json; charset=UTF-8' }
        ).pipe(
          map(({ response }) => response.data),
          catchError(({ response }) => [response])
        ).subscribe((response) => {
          setRoll({
            blog: response.blog.items[0],
            posts: response.post.items,
            categories: response.categories.items[0].items.item
          });
        })
      }
      return () => sub.unsubscribe()
    },
    [content.nav, props.location.pathname]
  );

  if (!roll) {
    return (
      <Layout>
        <Container>
          <Row>
            <Col md={12}>
              <Spinner contained/>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }

  const posts = selectedCategory
    ? roll.posts.filter(
      ({categories_o}) => categories_o.item.some(i => i.key === selectedCategory)
    )
    : roll.posts;

  return (
    <Layout>
      <Container>
        <Row>
          <Col md={12}>
            <h1 className="page-title">{roll.blog.title_s}</h1>
          </Col>
          <Col md={9}>
            <Row>
              {
                posts.length === 0 && <Col sm={12}>
                  <Card style={{ background: '#fff' }}>
                    <Empty description="There are no posts at this time. Please check back often :)"/>
                  </Card>
                </Col>
              }
              {
                posts.map((post) =>
                  <Col key={post.localId} xl={4} lg={6}>
                    <BlogPostCard {...post} hideSummary/>
                  </Col>
                )
              }
            </Row>
          </Col>
          <Col md={3}>
            <CategoryListing
              categories={roll.categories}
              selected={selectedCategory}
            />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export function CategoryListing(props) {
  const { categories, selected } = props;
  return (
    categories && categories.length > 0 ? <div className="blog__sidebar-bar-block">
      <h2 className="blog__side-bar-title">Categories</h2>
      <nav className="blog__side-bar-list">
        {
          selected
            ? <>
              <div>Viewing `{categories.find(({key}) => key === selected).value}`</div>
              <Link to={`/blog`}>
                <KeyboardArrowLeftIcon/> clear
              </Link>
            </>
            : categories.map(({ key, value }) =>
              <Link
                key={key}
                to={`/blog?category=${key}`}
                className="blog__side-bar-item"
              >
                {value}
              </Link>
            )
        }
      </nav>
    </div> : <></>
  );
}
