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

import React, { useState } from 'react';
import { Col, Row, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Anchor from "../shared/Anchor";
import { useDispatch, useSelector } from 'react-redux';
import Flag from 'react-world-flags';
import { changeCurrency, changeLocale } from '../../redux/actions/productsActions';

const FlagCodeMap = {
  de: 'de',
  en: 'us',
  en_us: 'us'
};

function Footer(props){

  const dispatch = useDispatch();

  const { footer, store } = useSelector(state => state.content);

  const {
    logo_s,
    logo_alt_t,
    logo_url_s,
    section_background_image_s
  } = footer;

  const {
    name,
    locales,
    currencies
  } = store;

  const {
    query: { locale, currency }
  } = useSelector(state => state.products);

  const [localesOpen, setLocalesOpen] = useState(false);

  const [currenciesOpen, setCurrenciesOpen] = useState(false);

  return (
    <footer className="landing__footer">
      {
        section_background_image_s &&
        <img className="landing__footer-background" src={section_background_image_s} alt="" />
      }
      <Container>
        <Row>
          <Col md={12}>
            <Dropdown className="landing__footer-locale-dropdown" direction="up" isOpen={localesOpen} toggle={() => setLocalesOpen(!localesOpen)}>
              <DropdownToggle caret>
                {FlagCodeMap[locale] ? <Flag code={FlagCodeMap[locale]}/> : locale}
              </DropdownToggle>
              <DropdownMenu>
                {
                  (locales || []).map((code) => (
                    <DropdownItem key={code} onClick={() => dispatch(changeLocale(code))}>
                      {FlagCodeMap[code] ? <Flag code={FlagCodeMap[code]}/> : code}
                    </DropdownItem>
                  ))
                }
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="landing__footer-currency-dropdown" direction="up" isOpen={currenciesOpen} toggle={() => setCurrenciesOpen(!currenciesOpen)}>
              <DropdownToggle caret>
                {currency}
              </DropdownToggle>
              <DropdownMenu>
                {
                  (currencies || []).map((code) => (
                    <DropdownItem key={code} onClick={() => dispatch(changeCurrency(code))}>{code}</DropdownItem>
                  ))
                }
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col md={12}>
            <p>Powered By</p>
            <Anchor href={logo_url_s}>
              <img className="landing__footer-logo" src={logo_s} alt={logo_alt_t}/>
            </Anchor>
          </Col>
          <Col md={12}>
            © {name} {new Date().getFullYear()}
          </Col>
        </Row>
      </Container>
    </footer>
  );



}

export default Footer;
