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

import React, { useMemo, useState } from 'react';
import Layout from './Layout';
import { Button, ButtonToolbar, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Alert from '../shared/Alert';
import Spinner from '../shared/Spinner';
import { addAddressComplete, editAddressComplete } from '../../redux/actions/usersActions';
import { RadioButton } from '../shared/form/RadioButton';
import { Link } from 'react-router-dom';
import { Empty } from '../shared/Empty';
import { useUser } from '../../util/component';
import * as qs from 'query-string';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

export function AddressCard({ address, user, showName }) {
  return (
    <address className="profile__contact">
      {
        ((showName === undefined) || (showName)) &&
        <p className="profile__name">
          {
            address.addressName
              ? address.addressName
              : `${address.firstName || user.firstName} ${address.lastName || user.lastName}`
          }
        </p>
      }
      <div className="profile__work">
        {address.phone ? <div>{address.phone}</div> : null}
        {address.mobile ? <div>{address.mobile}</div> : null}
        {address.fax ? <div>{address.fax}</div> : null}
      </div>
      {address.streetAddressLineOne ? <div>{address.streetAddressLineOne}</div> : null}
      {address.streetAddressLineTwo ? <div>{address.streetAddressLineTwo}</div> : null}
      {
        (address.city || address.postalCode) && (
          <div>
            {
              (address.city && address.postalCode)
                ? `${address.city}, ${address.postalCode}`
                : address.city || address.postalCode
            }
          </div>
        )
      }
      {address.state ? <div>{address.state}</div> : null}
      <div>{address.country}</div>
    </address>
  );
}

export const AddressForm = function (props) {

  const {
    error,
    onSuccess,
    onCancel,
    isEditMode,
    initialValues
  } = props;

  const [success, setSuccess] = useState();

  const dispatch = useAppDispatch();

  const submit = (values) => {
    success && setSuccess();
    return fetch('/api/1/customer/update.json', {
      body: JSON.stringify({ [isEditMode ? 'changeAddress' : 'addAddress']: [values] }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).then(async (response) => {
      const data = await response.json();
      if (response.status !== 200) {
        return { [FORM_ERROR]: data.message };
      }
      dispatch(isEditMode ? editAddressComplete(data) : addAddressComplete(data));
      setSuccess('Update successful.');
      onSuccess(data);
    });
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={submit}
    >
      {({ handleSubmit, submitError }) => (
        <form className="form address-form" onSubmit={handleSubmit}>
          {
            success &&
            <Alert color="success" className="alert--bordered" onDismiss={() => setSuccess()}>
              <p>{success}</p>
            </Alert>
          }
          {
            error &&
            <Alert color="danger" className="alert--bordered">
              <p>{error}</p>
            </Alert>
          }
          <Field
            name="id"
            component="input"
            type="hidden"
          />
          <div className="form__form-group">
            <span className="form__form-group-label">Address Name</span>
            <div className="form__form-group-field">
              <Field
                name="addressName"
                component="input"
                type="text"
              />
            </div>
          </div>
          <div className="form__form-group-columns">
            <div className="form__form-group form__form-group-col-left">
              <span className="form__form-group-label">First Name</span>
              <div className="form__form-group-field">
                <Field
                  name="firstName"
                  component="input"
                  type="text"
                />
              </div>
            </div>
            <div className="form__form-group form__form-group-col-right">
              <span className="form__form-group-label">Last Name</span>
              <div className="form__form-group-field">
                <Field
                  name="lastName"
                  component="input"
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">Street Address</span>
            <div className="form__form-group-field">
              <Field
                name="streetAddressLineOne"
                component="input"
                type="text"
              />
            </div>
          </div>
          <div className="form__form-group">
            <div className="form__form-group-field">
              <Field
                name="streetAddressLineTwo"
                component="input"
                type="text"
              />
            </div>
          </div>
          <div className="form__form-group-columns">
            <div className="form__form-group form__form-group-col-left">
              <span className="form__form-group-label">Country</span>
              <div className="form__form-group-field">
                <Field
                  name="country"
                  component="input"
                  type="text"
                />
              </div>
            </div>
            <div className="form__form-group form__form-group-col-right">
              <span className="form__form-group-label">State</span>
              <div className="form__form-group-field">
                <Field
                  name="state"
                  component="input"
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="form__form-group-columns">
            <div className="form__form-group form__form-group-col-left">
              <span className="form__form-group-label">City</span>
              <div className="form__form-group-field">
                <Field
                  name="city"
                  component="input"
                  type="text"
                />
              </div>
            </div>
            <div className="form__form-group form__form-group-col-right">
              <span className="form__form-group-label">Postcode</span>
              <div className="form__form-group-field">
                <Field
                  name="postalCode"
                  component="input"
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">Phone</span>
            <div className="form__form-group-field">
              <Field
                name="phone"
                component="input"
                type="text"
              />
            </div>
          </div>
          {submitError && <div className="error">{submitError}</div>}
          <ButtonToolbar className="form__button-toolbar">
            <Button color="primary" type="submit">Submit</Button>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          </ButtonToolbar>
        </form>
      )}
    </Form>
  );
};

export function AddressEntry(props) {

  const user = useAppSelector(state => state.users.user);
  const addressId = props.match.params.id;
  const queryString = qs.parse(props.location.search);
  const backUrl = queryString.origin || '/account/address-book';

  const isEditMode = useMemo(
    () => props.match.params.id != null,
    [props.match.params.id]
  );

  if (user == null) {
    return <Spinner/>;
  }

  return (
    <Layout>
      <Container>
        <Card>
          <CardBody>
            <h1 className="page-title">
              {`${isEditMode ? 'Edit' : 'Add'} Address`}
            </h1>
            <AddressForm
              user={user}
              isEditMode={isEditMode}
              onSuccess={() => props.history.push(backUrl)}
              onCancel={() => props.history.push(backUrl)}
              initialValues={
                (isEditMode && user.addresses.find(
                  (address) => address.id === addressId
                )) || {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email
                }
              }
            />
          </CardBody>
        </Card>
      </Container>
    </Layout>
  );
}

export function AddressSelection({ name, onChange, currentValue, returnUrl }) {

  const user = useUser();
  const { addresses } = user;

  let newAddressUrl = '/account/address-book/new';
  if (returnUrl) {
    newAddressUrl = `${newAddressUrl}?origin=${returnUrl}`;
  }

  return (
    <Row>
      {
        (addresses && addresses.length > 0) ? <>

          {addresses.map((address) =>
            <Col md={4} sm={6} key={address.id}>
              <RadioButton
                label={`${address.firstName || user.firstName} ${address.lastName || user.lastName}`}
                name={name}
                value={address.id}
                currentValue={currentValue}
                onChange={(e) => onChange(e.target.value)}
              />
              <div className="cart__delivery-time">
                <AddressCard address={address} user={user} showName={false}/>
              </div>
            </Col>
          )}
          <Col md={12}>
            <hr/>
            <Link to={newAddressUrl}>
              Add new address
            </Link>
          </Col>

        </> : <Col md={12}>
          <Empty
            description={
              <span>
                Please <Link to={newAddressUrl}>add an address</Link> to your address book.
              </span>
            }
          />
        </Col>
      }
    </Row>
  );
}

export default AddressCard;
