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

import React, { useState } from 'react';
import { Col, Row, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Anchor from "../shared/Anchor";
import Flag from 'react-world-flags';
import { changeCurrency, changeLocale } from '../../redux/actions/productsActions';
import { useFooter, useStoreSettings } from '../shared/hooks';
import { useDispatch, useSelector } from 'react-redux';

const FlagCodeMap = {
  de: 'de',
  en: 'us',
  en_us: 'us'
};

function Footer(props){
  const dispatch = useDispatch();
  const footer = useFooter();
  const storeSettings = useStoreSettings();
  const {
    query: { locale, currency }
  } = useSelector(state => state.products);

  const [localesOpen, setLocalesOpen] = useState(false);

  const [currenciesOpen, setCurrenciesOpen] = useState(false);

  return (
    <footer className="landing__footer">
      {
        footer &&
        footer.section_background_image_s &&
        <img className="landing__footer-background" src={footer.section_background_image_s} alt="" />
      }
      <Container>
        <Row>
          <Col md={12}>
            <Dropdown className="landing__footer-locale-dropdown" direction="up" isOpen={localesOpen} toggle={() => setLocalesOpen(!localesOpen)}>
              <DropdownToggle caret>
                {FlagCodeMap[locale] ? <Flag code={FlagCodeMap[locale]}/> : locale}
              </DropdownToggle>
              {
                storeSettings &&
                <DropdownMenu>
                  {
                    (storeSettings.locales || []).map((code) => (
                      <DropdownItem key={code} onClick={() => dispatch(changeLocale(code))}>
                        {FlagCodeMap[code] ? <Flag code={FlagCodeMap[code]}/> : code}
                      </DropdownItem>
                    ))
                  }
                </DropdownMenu>
              }
            </Dropdown>
            <Dropdown className="landing__footer-currency-dropdown" direction="up" isOpen={currenciesOpen} toggle={() => setCurrenciesOpen(!currenciesOpen)}>
              <DropdownToggle caret>
                {currency}
              </DropdownToggle>
              {
                storeSettings &&
                <DropdownMenu>
                  {
                    (storeSettings.currencies || []).map((code) => (
                      <DropdownItem key={code} onClick={() => dispatch(changeCurrency(code))}>{code}</DropdownItem>
                    ))
                  }
                </DropdownMenu>
              }
            </Dropdown>
          </Col>
          <Col md={12}>
            <p>Powered By</p>
            {
              footer &&
              <Anchor href={footer.logo_url_s}>
                <img className="landing__footer-logo" src={footer.logo_s} alt={footer.logo_alt_t}/>
              </Anchor>
            }
          </Col>
          <Col md={12}>
            © {storeSettings && storeSettings.name} {new Date().getFullYear()}
          </Col>
        </Row>
      </Container>
    </footer>
  );



}

export default Footer;
