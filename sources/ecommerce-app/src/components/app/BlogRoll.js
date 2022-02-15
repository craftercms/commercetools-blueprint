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
import { BlogPostCard } from './BlogTeaser';
import Spinner from '../shared/Spinner';
import { Empty } from '../shared/Empty';
import * as qs from 'query-string';
import KeyboardArrowLeftIcon from 'mdi-react/KeyboardArrowLeftIcon';
import { Link } from 'react-router-dom';
import { useCategories, usePosts } from '../shared/hooks';

export default function BlogRoll(props) {
  const {
    model
  } = props;

  const selectedCategory = qs.parse(props.location.search).category;
  const [postsFiltered, setPostsFiltered] = useState();
  const [paginationData] = useState({
    itemsPerPage: 500,
    currentPage: 0
  });
  const posts = usePosts(paginationData);
  const categories = useCategories();

  useEffect(() => {
    if (posts) {
      setPostsFiltered(
        selectedCategory
          ? posts.items.filter(
          ({categories_o}) => categories_o.some(i => i.key === selectedCategory)
          )
          : posts.items
      );
    }
  }, [posts, selectedCategory]);

  if (!model) {
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

  return (
    <Layout>
      <Container>
        <Row>
          <Col md={12}>
            <h1 className="page-title">{ model && model.craftercms.label}</h1>
          </Col>
          <Col md={9}>
            <Row>
              {
                postsFiltered && postsFiltered.length === 0 && <Col sm={12}>
                  <Card style={{ background: '#fff' }}>
                    <Empty description="There are no posts at this time. Please check back often :)"/>
                  </Card>
                </Col>
              }
              {
                postsFiltered && postsFiltered.map((post) =>
                  <Col key={post.craftercms.id} xl={4} lg={6}>
                    <BlogPostCard {...post} hideSummary/>
                  </Col>
                )
              }
            </Row>
          </Col>
          <Col md={3}>
            <CategoryListing
              categories={categories}
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
