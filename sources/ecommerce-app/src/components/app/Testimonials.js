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
  Col, Row, Container, Card, CardBody,
} from 'reactstrap';
import StarIcon from 'mdi-react/StarIcon';
import { useICE } from '../../util/component';

function Testimonials(props) {
  const {
    label,
    localId,
    title_s,
    testimonials_o
  } = props;
  const { props: ice } = useICE({ modelId: localId, label });
  return (
    <section className="landing__section" {...ice}>
      <Container>
        <Row>
          <Col md={12}>
            <h3 className="landing__section-title">{title_s}</h3>
          </Col>
        </Row>
        <Row className="landing__testimonials">
          {
            testimonials_o.map(({ customer_s, description_html_raw, link_s, stars_i }, index) =>
              <Col key={index} lg={4} md={6}>
                <a
                  href={link_s}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card>
                    <CardBody className="landing__testimonial">
                      <p className="landing__testimonial-name">{customer_s}</p>
                      <div className="landing__testimonial-stars">
                        {(
                          () => {
                            const stars = [];
                            for (let i = 0; i < stars_i; i++)
                              stars.push(<StarIcon key={i}/>);
                            return stars;
                          }
                        )()}
                      </div>
                      <p
                        className="landing__testimonial-review"
                        dangerouslySetInnerHTML={{ __html: description_html_raw }}
                      />
                    </CardBody>
                  </Card>
                </a>
              </Col>
            )
          }
        </Row>
      </Container>
    </section>
  );
}

export default Testimonials;
