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

import { Badge, Table } from 'reactstrap';
import React, { useEffect } from 'react';
import { FETCH_ORDERS, fetchOrders } from '../../redux/actions/usersActions';
import Spinner from '../shared/Spinner';
import { capitalize, money } from '../../util/string';
import { Link, useHistory } from 'react-router-dom';
import { Empty } from '../shared/Empty';
import { useDispatch, useSelector } from 'react-redux';

function OrderList() {
  const history = useHistory();

  const dispatch = useDispatch();
  const { orders: ordersTable, loading } = useSelector(state => state.users);
  const orders = Object.values(ordersTable);
  useEffect(
    () => {
      if (loading[FETCH_ORDERS] == null)
        dispatch(fetchOrders());
    },
    [dispatch, loading]
  );
  if (loading[FETCH_ORDERS]) {
    return <Spinner contained/>;
  }
  return (
    (orders.length === 0) ? (
      <Empty description={
        <>You haven't placed any orders yet. Visit <Link to="/catalog">the catalog</Link> to place your first order!</>
      } />
    ) : (
      <Table responsive hover>
        <thead>
        <tr>
          <th>Order ID</th>
          <th>Created</th>
          <th>Total</th>
          <th>Shipping Status</th>
          <th>Order Status</th>
        </tr>
        </thead>
        <tbody>
        {orders.map(({ id, created, modified, currency, totalPrice, taxedPrice, shippingStatus, paymentStatus, orderStatus }) =>
          <tr key={id} onClick={() => history.push(`/account/orders/${id}`)}>
            <td>{id.substr(0, id.indexOf('-'))}</td>
            <td>{created}</td>
            <td>{money(totalPrice + taxedPrice, currency)}</td>
            <td>{shippingStatus}</td>
            <td>
              <Badge color={orderStatus === 'COMPLETE' ? 'success' : 'warning'}>{capitalize(orderStatus)}</Badge>
            </td>
          </tr>
        )}
        </tbody>
      </Table>
    )
  );
}

export default OrderList;
