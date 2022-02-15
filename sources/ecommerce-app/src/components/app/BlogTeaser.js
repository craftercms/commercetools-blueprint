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
import { usePosts } from '../shared/hooks';
import { Field, RenderField } from '@craftercms/experience-builder/react';

function BlogTeaser(props) {

  const {
    title_s,
  } = props;
  const posts = usePosts();

  return (
    <Field component="section" className="landing__section" model={props}>
      <Container>
        <Row>
          <Col md={12}>
            <RenderField
              component="h3"
              model={props}
              fieldId="title_s"
              className="landing__section-title"
            >
              {title_s}
            </RenderField>
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
    </Field>
  );
}

export function BlogPostCard(props) {
  const { slug_s, title_s, image_s, summary_html_raw, hideSummary } = props;
  return (
    <Field component={Link} to={`/blog/${slug_s}`} model={props}>
      <Card>
        <CardBody className="landing__teaser">
          <RenderField
            component="img"
            renderTarget="src"
            className="landing__teaser-img"
            model={props}
            fieldId="image_s"
            alt=""
          />
          <RenderField
            component="h3"
            model={props}
            fieldId="title_s"
            className="landing__teaser-title"
          />
          {
            !hideSummary && summary_html_raw &&
            <Field
              component="p"
              model={props}
              fieldId="summary_html"
              className="landing__teaser-review"
              dangerouslySetInnerHTML={{ __html: summary_html_raw }}
            />
          }
        </CardBody>
      </Card>
    </Field>
  );
}

export default BlogTeaser;
