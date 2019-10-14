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

import React, { useContext, useState } from 'react';
import { Col, Container, Popover, PopoverBody, Row } from 'reactstrap';
import Anchor from '../shared/Anchor';
import { __RouterContext, Link } from 'react-router-dom';
import SearchIcon from 'mdi-react/SearchIcon';
import PersonCircleOutlineIcon from 'mdi-react/PersonCircleOutlineIcon';
import ShoppingCartIcon from 'mdi-react/ShoppingCartIcon';
import { useSelector } from 'react-redux';
import hamburger  from '../../img/burger.svg';

export default function Header() {

  const { history } = useContext(__RouterContext);
  const { content, users, products } = useSelector(state => state);
  const { query } = products;
  const [searchOpen, setSearchOpen] = useState(false);
  const [keywords, setKeywords] = useState(query.keywords || '');

  const
    {
      logo_s,
      logo_alt_t,
      logo_url_s
    } = content.header,
    { user } = users,
    nav = content.nav;

  return (
    <div className="landing__menu">
      <Container>
        <Row>
          <Col md={12}>
            <div className="landing__menu-wrap">
              <Anchor className="landing__menu-logo" href={logo_url_s}>
                <img src={logo_s} alt={logo_alt_t}/>
              </Anchor>
              <button
                type="button"
                className="landing__menu-deployer"
                onClick={() => {
                  const nav = document.querySelector('.landing__menu-nav');
                  if (nav.classList.contains('open')) {
                    nav.classList.remove('open');
                  } else {
                    nav.classList.add('open');
                  }
                }}
              >
                <img src={hamburger} alt="Open Menu"/>
              </button>
              <nav className="landing__menu-nav">
                {
                  nav.map((item, index) =>
                    <Anchor
                      key={index}
                      className="landing__menu-nav__item"
                      href={item.url}
                    >
                      {item.label}
                    </Anchor>
                  )
                }
                <Link
                  to="/cart"
                  className="landing__menu-nav__item"
                  onClick={() => void null}
                >
                  <ShoppingCartIcon/>
                </Link>
                <button
                  id="headerSearchButton"
                  className="landing__menu-nav__item"
                  onClick={() => {
                    setSearchOpen(true);
                    setTimeout(() => {
                      try {
                        document.getElementById('globalSearchInput').focus()
                      } catch(e) {

                      }
                    })
                  }}
                >
                  <SearchIcon/>
                </button>
                {
                  (user == null)
                    ? (
                      <Link className="landing__btn" to="/login">
                        Sign In
                      </Link>
                    ) : (
                      <Link className="landing__menu-nav__item" to="/account">
                        <PersonCircleOutlineIcon/>
                      </Link>
                    )
                }
              </nav>
            </div>
          </Col>
        </Row>
      </Container>
      <Popover
        placement="bottom"
        target="headerSearchButton"
        isOpen={searchOpen}
        toggle={() => setSearchOpen(false)}
      >
        <PopoverBody className="theme-light">
          <div className="form">
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <SearchIcon/>
              </div>
              <input
                id="globalSearchInput"
                type="text"
                name="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && history.push(`/search?q=${e.target.value}`)}
                placeholder="Search..."
              />
            </div>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
