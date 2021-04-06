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

import Layout from './Layout';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, ButtonToolbar, Card, CardBody, Col, Container, Row } from 'reactstrap';
import { LogInForm } from './LogIn';
import { getLoginFormDefaults, useCart, useProductsBranch, useUser } from '../../util/component';
import { CartSummary, OrderTotals } from './CartBody';
import CreditCardIcon from 'mdi-react/CreditCardIcon';
import { RadioButton } from '../shared/form/RadioButton';
import { AddressSelection } from './AddressCard';
import Spinner from '../shared/Spinner';
import { money } from '../../util/string';
import { Empty } from '../shared/Empty';
import {
  checkout, UPDATE_CART,
  updateCart
} from '../../redux/actions/productsActions';
import { useDispatch } from 'react-redux';

function address(cart, user, type) {
  if (cart == null || user == null) {
    return;
  }
  const cartAddress = cart[type === 'shipping' ? 'shippingAddress' : 'billingAddress'];
  if (cartAddress == null || user.addresses == null) {
    return;
  }
  const address = user.addresses.find((_address_) =>
    _address_.streetAddressLineOne === cartAddress.streetAddressLineOne
  );
  return address ? address.id : undefined;
}

function ShippingSelection({ onChange, selectedValue, items }) {
  return (
    <div className="form__form-group shipping-method-selection">
      <div className="form__form-group-field cart__delivery-field">
        {items ? items.map((item) =>
          <div className="cart__delivery" key={item.id}>
            <RadioButton
              label={item.name}
              name="shippingMethod"
              value={item.id}
              currentValue={selectedValue}
              onChange={() => onChange(item.id)}
            />
            <p className="cart__delivery-time">{item.description}</p>
            <p className="cart__delivery-price">{money(item.price, item.currency)}</p>
          </div>
        ) : (
          <Empty description="Shipping is not available for your location. :("/>
        )}
      </div>
    </div>
  );
}

function CreditCardForm({ cardNumber, cvc, expirationDate, nameOnCard, onChange }) {
  return (
    <form className="form payment__credit-cards">
      <div className="form__form-group">
        <span className="form__form-group-label">Card number</span>
        <div className="form__form-group-field">
          <div className="form__form-group-icon">
            <CreditCardIcon/>
          </div>
          <input
            type="text"
            name="cardNumber"
            value={cardNumber}
            onChange={onChange}
            placeholder="xxxx-xxxx-xxxx-xxxx"
          />
        </div>
      </div>
      <div className="form__form-group-date-cvc">
        <div className="form__form-group form__form-group-date">
          <span className="form__form-group-label">Expiration Date</span>
          <div className="form__form-group-field">
            <input
              type="month"
              name="expirationDate"
              placeholder="MM/YY"
              min="2019-07"
              value={expirationDate}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="form__form-group form__form-group-cvc">
          <span className="form__form-group-label">CVC</span>
          <div className="form__form-group-field">
            <input
              type="number"
              name="cvc"
              minLength={3}
              maxLength={4}
              value={cvc}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div className="form__form-group">
        <span className="form__form-group-label">Cardholder name</span>
        <div className="form__form-group-field">
          <input
            type="text"
            name="nameOnCard"
            placeholder="Name and Surname"
            value={nameOnCard}
            onChange={onChange}
          />
        </div>
      </div>
    </form>
  );
}

function CheckoutView({ history }) {

  const dispatch = useDispatch();
  const { loading } = useProductsBranch();
  const user = useUser({ redirect: '/checkout' });
  const cart = useCart({ onEmpty: () => history.push('/cart') });
  const [card, setState] = useState({
    cvc: '',
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
  });

  const [shippingAddress, setShippingAddress] = useState();
  const [billingAddress, setBillingAddress] = useState();
  const [shippingMethod, setShippingMethod] = useState();

  const onCardDataEntry = (e) => {
    const { value, name } = e.target;
    setState({ ...card, [name]: value });
  };

  const onAddressSelection = (value, type) => {
    (type === 'shipping' ? setShippingAddress : setBillingAddress)(value);
  };

  useEffect(
    () => {

      const shipping = address(cart, user, 'shipping');
      const billing = address(cart, user, 'billing');
      const method = (cart || {}).shippingMethod;

      shipping && (shipping !== shippingAddress) && setShippingAddress(shipping);
      billing && (billing !== billingAddress) && setBillingAddress(billing);
      method && (method !== shippingMethod) && setShippingMethod(method);

    },
    [user, cart, shippingAddress, billingAddress, shippingMethod]
  );

  useEffect(
    () => {
      if (cart) {

        const
          shippingCondition = (!!shippingAddress && shippingAddress !== address(cart, user, 'shipping')),
          billingCondition = (!!billingAddress && billingAddress !== address(cart, user, 'billing')),
          methodCondition = (!!shippingMethod && cart.shippingMethod !== shippingMethod);

        if (
          shippingCondition ||
          billingCondition ||
          methodCondition
        ) {
          dispatch(updateCart({
            ...shippingCondition ? { shippingAddress } : {},
            ...billingCondition ? { billingAddress } : {},
            ...methodCondition ? { shippingMethod } : {}
          }));
        }

      }

    },
    [dispatch, user, cart, shippingAddress, billingAddress, shippingMethod]
  );

  const checkoutDisabled = useMemo(
    () => !(
      shippingAddress &&
      billingAddress &&
      shippingMethod &&
      card.cvc &&
      card.nameOnCard &&
      card.cardNumber &&
      card.expirationDate
    ),
    [shippingAddress, billingAddress, shippingMethod, card]
  );

  return (
    <Layout>
      <Container>
        <Row>
          {(cart == null) ? <Col md={12}><Spinner contained/></Col> : (user == null) ? <>

            <Col md={12} lg={12}>
              <Card>
                <CardBody>
                  <div className="text-center">
                    <h1 className="page-title">Checkout</h1>
                    <p className="page-subhead subhead">
                      In order to checkout please sign in or create an account if you don't have one.
                    </p>
                    <div className="payment-view__login">
                      <LogInForm initialValues={getLoginFormDefaults()}/>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

          </> : <>

            <Col md={9}>
              <Card>
                <CardBody>

                  <div className="card__title">
                    <h1 className="bold-text">Checkout</h1>
                  </div>
                  <div className="payment">
                    <fieldset className="payment__checkout-section">
                      <legend>Shipping Address</legend>
                      <AddressSelection
                        returnUrl="/checkout"
                        name="shippingAddress"
                        currentValue={shippingAddress}
                        onChange={(value) => onAddressSelection(value, 'shipping')}
                      />
                    </fieldset>
                    <fieldset className="payment__checkout-section">
                      <legend>Billing Address</legend>
                      <AddressSelection
                        returnUrl="/checkout"
                        name="billingAddress"
                        currentValue={billingAddress}
                        onChange={(value) => onAddressSelection(value, 'billing')}
                      />
                    </fieldset>
                    <fieldset className="payment__checkout-section">
                      <legend>Shipping Method</legend>
                      {
                        loading[UPDATE_CART] ? <Spinner small/> : cart.shippingMethods ? (
                          <ShippingSelection
                            items={cart.shippingMethods}
                            selectedValue={shippingMethod}
                            onChange={(value) => setShippingMethod(value)}
                          />
                        ) : <Empty description="Select shipping address to view available shipping methods"/>
                      }
                    </fieldset>
                    <fieldset className="payment__checkout-section">
                      <legend>Payment Method</legend>
                      <CreditCardForm {...card} onChange={onCardDataEntry}/>
                    </fieldset>
                  </div>

                </CardBody>
              </Card>
            </Col>

            <Col md={3}>
              <CartSummary/>
              <OrderTotals/>
              <ButtonToolbar className="form__button-toolbar">
                <Button
                  type="button"
                  color="primary"
                  onClick={onCheckout}
                  disabled={checkoutDisabled}
                  className="payment__complete-purchase-btn"
                >
                  Complete Purchase
                </Button>
              </ButtonToolbar>
            </Col>

          </>}
        </Row>
      </Container>
    </Layout>
  );

  function onCheckout() {
    dispatch(checkout({ card, shippingMethod, shippingAddress, billingAddress }, history.push));
  }

}

export default CheckoutView;
