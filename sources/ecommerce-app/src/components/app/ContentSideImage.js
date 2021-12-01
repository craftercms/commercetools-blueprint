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

import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Field } from '@craftercms/experience-builder/react';

function ContentSideImage(props) {
  const {
    section_background_image_s,
    contentAlignment_s,
    content_html_raw,
    image_alt_s,
    image_s,
    title_s
  } = props;
  const
    CopyColumn = (
      <Col md={6} sm={12} xs={12}>
        <div className="landing__code-text">
          <div className="landing__code-wrap">
            <Field component="h3" model={props} fieldId="title_s">{title_s}</Field>
            <Field
              component="p"
              model={props}
              fieldId="content_html"
              className="landing__section-description"
              dangerouslySetInnerHTML={{ __html: content_html_raw }}
            />
          </div>
        </div>
      </Col>
    ),
    ImageColumn = (
      <Col md={6} sm={12} xs={12}>
        <div className="landing__code-img landing__code-img--no-shadow">
          <div className="landing__code-wrap">
            <Field
              component="img"
              className="landing__img landing__img--over"
              model={props}
              fieldId="image_s"
              src={image_s}
              alt={image_alt_s || ''}
            />
          </div>
        </div>
      </Col>
    );
  return (
    <Field component="section" className="landing__section" model={props}>
      {
        section_background_image_s &&
        <img
          className="landing__section-background landing__section-background--technologies"
          src={section_background_image_s} alt=""
        />
      }
      <Container>
        <Row
          className={`landing__code ${
            contentAlignment_s === 'right'
              ? 'landing__code--right'
              : 'landing__code--first landing__code--left'
          }`}
        >
          {
            (contentAlignment_s === 'right')
              ? (
                <>
                  {ImageColumn}
                  {CopyColumn}
                </>
              ) : (
                <>
                  {CopyColumn}
                  {ImageColumn}
                </>
              )
          }
        </Row>
      </Container>
    </Field>
  );
}

export default ContentSideImage;
