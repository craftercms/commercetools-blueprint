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
import { Button, ButtonGroup, ButtonToolbar, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity } from '../../redux/actions/productsActions';
import { money } from '../../util/string';
import AddCircleOutlineIcon from 'mdi-react/AddCircleOutlineIcon';
import DeleteForeverIcon from 'mdi-react/DeleteForeverIcon';
import RemoveCircleOutlineIcon from 'mdi-react/RemoveCircleOutlineIcon';
import { Empty } from '../shared/Empty';
import { useCartUpdateInFlight } from '../../util/component';
import { useDispatch, useSelector } from 'react-redux';

export function CartSummary() {
  const { cart } = useSelector(state => state.products);
  return (
    (cart.items.length === 0) ? (
      <h2 className="text-center">Your cart is empty</h2>
    ) : (
      <Table className="table--bordered cart__table cart__summary-table" responsive>
        <thead>
        <tr>
          <th>Product</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {
          cart && cart.items.map((item) => (
            <tr key={item.id}>
              <td>
                <span className="cart__preview-img">
                  <img src={item.images[0].url} alt="product_preview"/>
                </span>
                <span className="cart__product-name--sm">
                  {item.productName}
                </span>
              </td>
              <td>
                <div className="cart__quantity-wrapper">
                  <span className="cart__quantity-display">x{item.quantity}</span>
                </div>
              </td>
            </tr>
          ))
        }
        </tbody>
      </Table>
    )
  );
}

function CartBody(props) {
  const dispatch = useDispatch();
  const { cart } = useSelector(state => state.products);
  const options = {
    ...props.displayOptions
      ? { ...CartBody.defaultProps.displayOptions, ...props.displayOptions }
      : CartBody.defaultProps.displayOptions
  };
  const updatesInFlight = useCartUpdateInFlight();
  return (
    (cart.items.length === 0) ? (
      <Empty description={
        <>
          <span>Your cart is empty.</span><br/>
          <span>If you had left items in your cart, simply <Link to="/login">log in</Link> to recover them.</span>
        </>
      } />
    ) : (
      <Table className="table--bordered cart__table" responsive>
        <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          {options.showPrice && <th>Price</th>}
          {options.showTax && <th>Tax</th>}
          {options.showTotal && <th>Total</th>}
          {options.showRemove && <th/>}
        </tr>
        </thead>
        <tbody>
        {
          cart && cart.items.map((item) => (
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
              <td>
                <div className="cart__quantity-wrapper">
                  <span className="cart__quantity-display">{item.quantity}</span>
                  {
                    options.showQuantityModifiers &&
                    <ButtonToolbar>
                      <ButtonGroup className="btn-group--icons">
                        <Button
                          type="button"
                          className="cart__remove-one-button sm"
                          outline
                          onClick={() =>
                            dispatch(updateCartItemQuantity({
                              ...item,
                              quantity: item.quantity - 1
                            }))
                          }
                          disabled={updatesInFlight}
                        >
                          <RemoveCircleOutlineIcon/>
                        </Button>
                        <Button
                          type="button"
                          className="cart__add-one-button sm"
                          outline
                          onClick={() =>
                            dispatch(
                              updateCartItemQuantity({
                                ...item,
                                quantity: item.quantity + 1
                              })
                            )
                          }
                          disabled={updatesInFlight}
                        >
                          <AddCircleOutlineIcon/>
                        </Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  }
                </div>
              </td>
              {options.showPrice && <td>{money(item.unitPrice, cart.currency)}</td>}
              {options.showTax && <td>{money(item.taxedPrice, cart.currency)}</td>}
              {options.showTotal && <td>{money(item.totalPrice, cart.currency)}</td>}
              {options.showRemove && <td>
                <button
                  className="cart__table-btn" type="button"
                  onClick={() => dispatch(removeFromCart(item))}
                >
                  <DeleteForeverIcon/> Remove
                </button>
              </td>}
            </tr>
          ))
        }
        </tbody>
      </Table>
    )
  );
}

export function OrderTotals(props) {
  const { cart } = useSelector(state => state.products);
  return (
    <>
      <h3 className="order-details__title">Order Details</h3>
      <div className="order-details__body">
        <table className="order-details__table">
          <tbody>
          <tr>
            <th className="order-details__th">Products</th>
            <td className="order-details__td">{money(cart.items.reduce((sum, item) => (sum + item.totalPrice), 0), cart.currency)}</td>
          </tr>
          <tr>
            <th className="order-details__th">Shipping</th>
            <td className="order-details__td">{money(cart.shippingPrice, cart.currency)}</td>
          </tr>
          <tr>
            <th className="order-details__th">Sub Total</th>
            <td className="order-details__td">{money(cart.totalPrice, cart.currency)}</td>
          </tr>
          {
            cart.taxedPrice &&
            <tr>
              <th className="order-details__th">Tax</th>
              <td className="order-details__td">{money(cart.taxedPrice - cart.totalPrice, cart.currency)}</td>
            </tr>
          }
          <tr>
            <th className="order-details__th">Total</th>
            <td className="order-details__td">{money(cart.taxedPrice, cart.currency)}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

CartBody.defaultProps = {
  displayOptions: {
    showTax: true,
    showPrice: true,
    showTotal: true,
    showRemove: true,
    showQuantityModifiers: true
  }
};

export default CartBody;
