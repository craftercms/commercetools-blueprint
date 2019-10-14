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
import Layout from './Layout';
import { ButtonToolbar, Card, CardBody, Col, Container, Row } from 'reactstrap';

import { Link } from 'react-router-dom';
import { money } from '../../util/string';
import Spinner from '../shared/Spinner';
import CartBody from './CartBody';
import { useCart } from '../../util/component';

function CartView() {
  const cart = useCart();
  return (
    <Layout>
      <Container>
        <Row>
          <Col md={12} lg={12}>
            {
              (cart == null)
                ? <Spinner contained/>
                : <Card className="cart">
                  <CardBody>
                    <div className="card__title">
                      <h1 className="page-title bold-text">Cart</h1>
                    </div>
                    <CartBody/>
                    {
                      (cart.items.length > 0) &&
                      <div className="cart__total-wrapper">
                        <h4 className="cart__total">Sub-total: {money(cart.totalPrice, cart.currency)}</h4>
                        <ButtonToolbar className="form__button-toolbar">
                          <Link className="btn btn-primary" to="/checkout">Checkout</Link>
                        </ButtonToolbar>
                      </div>
                    }
                  </CardBody>
                </Card>
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default CartView;


