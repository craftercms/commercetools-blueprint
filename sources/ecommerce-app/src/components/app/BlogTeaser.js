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

/* eslint-disable max-len */
import React from 'react';
import {
  Col,
  Row,
  Container,
  Card,
  CardBody
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useICE } from '../../util/component';
import { usePosts } from '../shared/hooks';

function BlogTeaser(props) {

  const {
    label,
    localId,
    title_s,
  } = props;

  const { props: ice } = useICE({ modelId: localId, label });
  const posts = usePosts();

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
            posts &&
            posts.items.map((post) =>
              <Col key={post.craftercms.id} lg={4} md={6}>
                <BlogPostCard {...post}/>
              </Col>
            )
          }
        </Row>
      </Container>
    </section>
  );
}

export function BlogPostCard({ localId, label, slug_s, title_s, image_s, summary_html_raw, hideSummary }) {
  const { props: ice } = useICE({ modelId: localId, label });
  return (
    <Link to={`/blog/${slug_s}`}>
      <Card {...ice}>
        <CardBody className="landing__teaser">
          <img src={image_s} alt="" className="landing__teaser-img"/>
          <h3 className="landing__teaser-title">{title_s}</h3>
          {
            !hideSummary && summary_html_raw &&
            <p
              className="landing__teaser-review"
              dangerouslySetInnerHTML={{ __html: summary_html_raw }}
            />
          }
        </CardBody>
      </Card>
    </Link>
  );
}

export default BlogTeaser;
