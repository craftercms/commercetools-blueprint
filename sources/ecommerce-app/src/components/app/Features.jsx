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

import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import { Field } from '@craftercms/experience-builder/react';

function Features(props) {
  const {
    title_s,
    features_o,
    closingContent_html_raw,
    openingContent_html_raw
  } = props;
  return (
    <Field component='section' className="landing__section" model={props}>
      <Container>
        <Row>
          <Col md={12}>
            <Field
              component="h3"
              model={props}
              fieldId="title_s"
              className="landing__section-title"
            >
              {title_s}
            </Field>
            {openingContent_html_raw &&
            <Field
              model={props}
              fieldId="openingContent_html"
              className="landing__feature landing__feature-caption"
              style={{ width: '100%' }}
              dangerouslySetInnerHTML={{ __html: openingContent_html_raw }}
            />}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="landing__features-wrap">
              {
                features_o.map(({ description_t, icon_s, title_s }, index) =>
                  <div className="landing__feature" key={index}>
                    <div className="landing__feature-img-wrap">
                      <Field
                        component="img"
                        model={props}
                        fieldId="features_o.icon_s"
                        index={index}
                        src={icon_s}
                      />
                    </div>
                    <Field
                      component="p"
                      model={props}
                      fieldId="features_o.title_s"
                      index={index}
                      className="landing__feature-title"
                    >
                      {title_s}
                    </Field>
                    <Field
                      component="p"
                      model={props}
                      fieldId="features_o.description_t"
                      index={index}
                      className="landing__feature-caption"
                    >
                      {description_t}
                    </Field>
                  </div>
                )
              }
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <p className="landing__additional-title" dangerouslySetInnerHTML={{ __html: closingContent_html_raw }}/>
          </Col>
        </Row>
      </Container>
    </Field>
  );
}

export default Features;
