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

/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import renderCheckBoxField from '../shared/form/CheckBox';
import Alert from '../shared/Alert';
import { loginComplete } from '../../redux/actions/usersActions';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { useDispatch } from 'react-redux';

const renderTextField = ({ input, label, meta: { touched, error }, children }) => (
  <TextField
    className="material-form__field"
    label={label}
    error={touched && error}
    children={children}
    value={input.value}
    onChange={(e) => {
      e.preventDefault();
      input.onChange(e.target.value);
    }}
  />
);

renderTextField.propTypes = {
  input: PropTypes.shape().isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  children: PropTypes.arrayOf(PropTypes.element),
};

renderTextField.defaultProps = {
  meta: null,
  label: '',
  children: [],
};

function ProfileSettings(props) {

  const dispatch = useDispatch();

  const { initialValues } = props;
  const [success, setSuccess] = useState();

  function submit(values) {
    success && setSuccess();
    return fetch('/api/1/customer/update.json', {
      body: JSON.stringify(values),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(async (response) => {
      if (response.status !== 200) {
        const data = await response.json();
        return { [FORM_ERROR]: data.message };
      }
      setSuccess('Update successful.');
      return response.json();
    }).then((user) => {
      dispatch(loginComplete(user))
    });
  }

  return (
    <Form
      initialValues={initialValues}
      onSubmit={submit}
    >
      {({ handleSubmit, form, submitError }) => (
        <form className="form" onSubmit={handleSubmit}>
          {
            success &&
            <Alert color="success" className="alert--bordered" onDismiss={() => setSuccess()}>
              <p>{success}</p>
            </Alert>
          }
          <div className="form__form-group">
            <span className="form__form-group-label">Name</span>
            <div className="form__form-group-field">
              <Field
                type="text"
                name="firstName"
                component="input"
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">Middle Name</span>
            <div className="form__form-group-field">
              <Field
                type="text"
                name="middleName"
                component="input"
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">Last Name</span>
            <div className="form__form-group-field">
              <Field
                type="text"
                name="lastName"
                component="input"
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">Phone Number</span>
            <div className="form__form-group-field">
              <Field
                type="text"
                name="phone"
                component="input"
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">E-mail</span>
            <div className="form__form-group-field">
              <Field
                type="text"
                name="email"
                component="input"
              />
            </div>
          </div>
          {submitError && <div className="error">{submitError}</div>}
          <ButtonToolbar className="form__button-toolbar">
            <Button color="primary" type="submit">Update profile</Button>
            <Button type="button" onClick={form.reset}>
              Cancel
            </Button>
          </ButtonToolbar>
        </form>
      )}
    </Form>
  );

}

function ChangePasswordFormComponent(props) {
  const [type, setType] = useState('password');
  const [success, setSuccess] = useState();

  function submit(values) {
    success && setSuccess();
    return fetch('/api/1/customer/change-password.json', {
      body: JSON.stringify(values),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(async (response) => {
      if (response.status !== 200) {
        const data = await response.json();
        return { [FORM_ERROR]: data.message };
      }
      setSuccess('Update successful.');
      return response.json();
    });
  }

  return (
    <Form
      onSubmit={submit}
    >
      {({ handleSubmit, form, submitError }) => (
        <form className="form" onSubmit={values => handleSubmit(values).then(form.reset)}>
          {
            success &&
            <Alert color="success" className="alert--bordered" onDismiss={() => setSuccess()}>
              <p>{success}</p>
            </Alert>
          }
          <div className="form__form-group">
            <span className="form__form-group-label">Current Password</span>
            <div className="form__form-group-field">
              <Field
                name="currentPassword"
                component="input"
                type={type}
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">New Password</span>
            <div className="form__form-group-field">
              <Field
                name="newPassword"
                component="input"
                type={type}
              />
            </div>
          </div>
          <div className="form__form-group">
            <div className="form__form-group-field">
              <Field
                name="showPassword"
                onChange={(value, checked) => setType(checked ? 'text' : 'password')}
                component={renderCheckBoxField}
                label="Show passwords"
              />
            </div>
          </div>
          {submitError && <div className="error">{submitError}</div>}
          <ButtonToolbar className="form__button-toolbar">
            <Button color="primary" type="submit">Submit</Button>
            <Button type="button" onClick={form.reset}>
              Cancel
            </Button>
          </ButtonToolbar>
        </form>
      )}
    </Form>
  );
}

export const ChangePasswordForm = ChangePasswordFormComponent;

export default ProfileSettings;
