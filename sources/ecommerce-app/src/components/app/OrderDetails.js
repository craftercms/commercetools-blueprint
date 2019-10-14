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
import { Badge, Card, CardBody, Col, Container, Row, Table } from 'reactstrap';

import Layout from './Layout';
import { useOrder } from '../../util/component';
import Spinner from '../shared/Spinner';
import { Link } from 'react-router-dom';
import { capitalize, money } from '../../util/string';
import Collapse from '../shared/Collapse';


function OrderDetails(props) {

  const id = props.match.params.id;
  const order = useOrder(id);

  return (
    <Layout>
      <Container>
        <Row>
          <Col md={9}>

            <Card>
              <CardBody>
                <h1 className="page-title">
                  {`Order # ${id} - Details`}
                </h1>

                {order == null ? <Spinner contained/> : <>

                  <Table className="table--bordered cart__table" responsive>
                    <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      order.items && order.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <span className="cart__preview-img">
                              <img src={item.images[0].url} alt="product_preview"/>
                            </span>
                            <Link
                              className="cart__product-name"
                              to={`/catalog/${item.productId}`}
                            >
                              {item.productName}
                            </Link>
                          </td>
                          <td>{item.quantity}</td>
                          <td>{money(item.unitPrice, order.currency)}</td>
                          <td>{money(item.totalPrice, order.currency)}</td>
                        </tr>
                      ))
                    }
                    </tbody>
                  </Table>

                </>}

              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            {
              order && order.items && <>

                <table className="table">
                  <tbody>
                  <tr>
                    <th>Order Status</th>
                    <td>
                      <Badge color={['OPEN', 'CONFIRMED', 'COMPLETE'].includes(order.orderStatus) ? 'success' : 'warning'}>
                        {capitalize(order.orderStatus)}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <th>Payment Status</th>
                    <td>
                      <Badge color={order.paymentStatus === 'COMPLETE' ? 'success' : 'warning'}>
                        {capitalize(order.paymentStatus || 'Pending')}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <th>Shipping Status</th>
                    <td>
                      <Badge color={order.shippingStatus === 'COMPLETE' ? 'success' : 'warning'}>
                        {capitalize(order.shippingStatus || 'Pending')}
                      </Badge>
                    </td>
                  </tr>
                  </tbody>
                </table>

                <div className="order-details__body">
                  <table className="order-details__table">
                    <tbody>
                    <tr>
                      <th className="order-details__th">Products</th>
                      <td className="order-details__td">{money(order.items.reduce((sum, item) => (sum + item.totalPrice), 0), order.currency)}</td>
                    </tr>
                    <tr>
                      <th className="order-details__th">Shipping</th>
                      <td className="order-details__td">{money(order.shippingPrice, order.currency)}</td>
                    </tr>
                    <tr>
                      <th className="order-details__th">Sub Total</th>
                      <td className="order-details__td">{money(order.totalPrice, order.currency)}</td>
                    </tr>
                    <tr>
                      <th className="order-details__th">Tax</th>
                      <td className="order-details__td">{money(order.taxedPrice - order.totalPrice, order.currency)}</td>
                    </tr>
                    <tr>
                      <th className="order-details__th">Total</th>
                      <td className="order-details__td">{money(order.taxedPrice, order.currency)}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </>
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default OrderDetails;

// Payment:
// BALANCE_DUE
// PENDING
// PAID
// CREDIT_OWED
// FAILED
//
// Shipping:
// READY
// PENDING
// PARTIAL
// DELAYED
// SHIPPED
// BACK_ORDER
//
// Order:
// OPEN
// CONFIRMED
// COMPLETE
// CANCELLED
