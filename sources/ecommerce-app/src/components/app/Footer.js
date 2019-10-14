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

import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import Anchor from "../shared/Anchor";
import { useSelector } from 'react-redux';

function Footer(props){
  const {
    logo_s,
    logo_alt_t,
    logo_url_s,
    section_background_image_s
  } = useSelector(state => state.content.footer);
  return (
    <footer className="landing__footer">
      {
        section_background_image_s &&
        <img className="landing__footer-background" src={section_background_image_s} alt="" />
      }
      <Container>
        <Row>
          <Col md={12}>
            <Anchor className="landing__footer-text" href={logo_url_s}>
              <img className="landing__footer-logo" src={logo_s} alt={logo_alt_t}/>
            </Anchor>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
