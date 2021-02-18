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
import { Col, Row, Container } from 'reactstrap';
import A from "../shared/Anchor";
import { Field } from '@craftercms/studio-guest';

function Hero(props) {
  const {
    title_t,
    image_s,
    image_alt_t,
    section_background_image_s,
    content_html_raw,
    buttons_o
  } = props;
  return (
    <Field
      model={props}
      className="landing__header"
      style={
        section_background_image_s
          ? { backgroundImage: `url(${section_background_image_s})` }
          : {}
      }
    >
      <Container>
        <Row>
          <Col md={12}>
            <Field
              component="h2"
              model={props}
              fieldId="title_t"
              className="landing__header-title"
            >
              {title_t}
            </Field>
            <Field
              model={props}
              fieldId="content_html"
              className="landing__header-subhead"
              dangerouslySetInnerHTML={{ __html: content_html_raw }}
            />
            {
              buttons_o.map(({ label_s, link_s }, index) =>
                <A
                  key={index}
                  href={link_s}
                  className="landing__btn landing__btn--header"
                >
                  {label_s}
                </A>
              )
            }
            {
              image_s &&
              <Field
                component="img"
                className="landing__header-img"
                model={props}
                fieldId="image_s"
                src={image_s}
                alt={image_alt_t || ''}
              />
            }
          </Col>
        </Row>
      </Container>
    </Field>
  );
}

export default Hero;
