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

import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';

import Anchor from '../shared/Anchor';
import { registrationComplete } from '../../redux/actions/usersActions';
import { Button, ButtonToolbar } from 'reactstrap';
import CheckboxMarkedCircleIcon from 'mdi-react/CheckboxMarkedCircleIcon';
import EmailIcon from 'mdi-react/EmailIcon';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import MailRuIcon from 'mdi-react/MailRuIcon';
import Alert from '../shared/Alert';
import { catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { useHeader } from '../shared/hooks';
import { Form, Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';

export const RegisterFormComponent = memo(function ({ onSuccess }) {

  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const submit = (values) => {
    ajax.post(
      `/api/1/customer/signup.json`,
      values,
      { 'Content-Type': 'application/json; charset=UTF-8' }
    ).pipe(
      catchError((error) => [error])
    ).subscribe((response) => {
      if (response.name === 'AjaxError') {
        setError(response.response.message);
      } else {
        onSuccess && onSuccess(response.response, values);
      }
    })
  };

  return (
    <Form
      onSubmit={submit}
    >
      {({ handleSubmit }) => (
        <form className="form" onSubmit={handleSubmit}>
          {
            error &&
            <Alert color="danger" className="alert--bordered">
              <p>{error}</p>
            </Alert>
          }
          <div className="form__form-group">
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <AccountOutlineIcon/>
              </div>
              <Field
                name="firstName"
                component="input"
                type="text"
                placeholder="First Name"
              />
            </div>
          </div>
          <div className="form__form-group">
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <AccountOutlineIcon/>
              </div>
              <Field
                name="lastName"
                component="input"
                type="text"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="form__form-group">
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <MailRuIcon/>
              </div>
              <Field
                name="email"
                component="input"
                type="email"
                placeholder="E-mail (username)"
              />
            </div>
          </div>
          <div className="form__form-group form__form-group--forgot">
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <KeyVariantIcon/>
              </div>
              <Field
                name="password"
                component="input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
              />
              <button
                type="button"
                className={`form__form-group-button${showPassword ? ' active' : ''}`}
                onClick={() => setShowPassword(!showPassword)}
              ><EyeIcon/>
              </button>
            </div>
          </div>
          <div className="account__btns">
            <button
              type="submit"
              className="btn btn-primary account__btn"
            >
              Sign Up
            </button>
          </div>
        </form>
      )}
    </Form>
  );
});

export const RegisterForm = RegisterFormComponent;

const RegistrationConfirmation = () => (
  <div className="email-confirmation">
    <div className="email-confirmation__icon">
      <EmailIcon className="email-confirmation__mail"/>
      <CheckboxMarkedCircleIcon className="email-confirmation__check"/>
    </div>
    <h3 className="email-confirmation__title">Your account was created successfully.</h3>
    <p className="email-confirmation__sub">Please check your email to confirm your account.</p>
    <ButtonToolbar className="email-confirmation__buttons">
      <Button color="primary">Resend E-mail</Button>
    </ButtonToolbar>
  </div>
);
const Register = () => {
  const dispatch = useDispatch();
  const success = useSelector(state => state.users.registerConfirmPending);
  const header = useHeader();

  return (
    <div className="account">
      <div className="account__wrapper">
        <div className="account__card">
          <div className="login-view__logo">
            {
              header &&
              <Anchor href={header.logo_url_s} className="login-view__logo">
                <img src={header.logo_s} alt={header.logo_alt_t} className="login-view__logo-img"/>
              </Anchor>
            }
          </div>
          {
            success
              ? <RegistrationConfirmation/>
              : <>
                <div className="account__head">
                  <h3 className="account__title">
                    Create an account
                  </h3>
                </div>
                <RegisterForm onSuccess={() => dispatch(registrationComplete())}/>
                <div className="account__have-account">
                  <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
              </>
          }
        </div>
      </div>
    </div>
  );
};

export default Register;
