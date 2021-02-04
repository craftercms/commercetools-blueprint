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

import React, { useEffect, useState } from 'react';
import Anchor from '../shared/Anchor';
import { getLoginFormDefaults } from '../../util/component';

import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import { Link, useHistory } from 'react-router-dom';
import renderCheckBoxField from '../shared/form/CheckBox';
import Alert from '../shared/Alert';
import { ajax } from 'rxjs/ajax';
import { catchError } from 'rxjs/operators';
import { loginComplete } from '../../redux/actions/usersActions';
import { useHeader } from '../shared/hooks';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Form, Field } from 'react-final-form';

function LogInFormComponent(props) {

  const dispatch = useAppDispatch();
  const history = useHistory();
  const state = useAppSelector(state => state);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();

  const onSubmit = (data) => {
    if (data) {
      if (data.rememberMe) {
        localStorage.setItem(`${process.env.REACT_APP_STORE_KEY}.email`, data.email);
      } else {
        localStorage.removeItem(`${process.env.REACT_APP_STORE_KEY}.email`);
      }
      ajax.post(
        `/api/1/security/login.json`,
        data,
        {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      ).pipe(
        catchError((error) => [error])
      ).subscribe((response) => {
        if (response.name === 'AjaxError') {
          setError(response.response.message);
        } else {
          dispatch(loginComplete(response.response));
          history.push(state.users.loginRedirect);
        }
      });
    }
  };

  useEffect(
    () => {
      const meRemembered = !!localStorage.getItem(`${process.env.REACT_APP_STORE_KEY}.email`);
      document.querySelectorAll('.form input')[meRemembered ? 1 : 0].focus();
    },
    []
  );

  return (
    <Form
      initialValues={getLoginFormDefaults()}
      onSubmit={onSubmit}
    >
      {({ handleSubmit } ) => (
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
                name="email"
                type="text"
                component="input"
                placeholder="Name"
              />
            </div>
          </div>
          <div className="form__form-group">
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
            <div className="account__forgot-password">
              <a href="/">Forgot a password?</a>
            </div>
          </div>
          <div className="form__form-group">
            <div className="form__form-group-field">
              <Field
                type="checkbox"
                name="rememberMe"
                label="Remember me"
                component={renderCheckBoxField}
              />
            </div>
          </div>
          <div className="account__btns">
            <button className="btn btn-primary account__btn account__sign-in-btn" type="submit">Sign In</button>
            <Link className="btn btn-outline-primary account__btn account__register-btn" to="/register">
              Create Account
            </Link>
          </div>
        </form>
      )}
    </Form>
  );

}

export const LogInForm = LogInFormComponent;

function LogIn() {
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
          <div className="account__head">
            <h3 className="account__title">Welcome</h3>
            <h4 className="account__subhead subhead">Please log in</h4>
          </div>
          <LogInForm/>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
