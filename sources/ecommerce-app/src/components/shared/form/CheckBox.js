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

/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import CheckIcon from 'mdi-react/CheckIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export function CheckBox(props) {

  const {
    disabled,
    className,
    name,
    value,
    onChange,
    label,
    color,
    checked
  } = props;

  const CheckboxClass = classNames({
    'checkbox-btn': true,
    disabled,
  });

  return (
    <label
      className={`${CheckboxClass} ${className ? ` checkbox-btn--${className}` : ''}`}
      htmlFor={`${name}[${value}]`}
    >
      <input
        className="checkbox-btn__checkbox"
        type="checkbox"
        id={`${name}[${value}]`}
        name={name}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        value={value}
      />
      <span
        className="checkbox-btn__checkbox-custom"
        style={color ? { background: color, borderColor: color } : {}}
      >
        <CheckIcon/>
      </span>
      {
        className === 'button'
          ? (
            <span className="checkbox-btn__label-svg">
              <CheckIcon className="checkbox-btn__label-check"/>
              <CloseIcon className="checkbox-btn__label-uncheck"/>
            </span>
          )
          : (
            ''
          )
      }
      <span className="checkbox-btn__label">
        {label}
      </span>
    </label>
  );
}

class CheckBoxField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]).isRequired,
    label: PropTypes.string,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    color: PropTypes.string,
  };

  static defaultProps = {
    label: '',
    defaultChecked: false,
    disabled: false,
    className: '',
    color: '',
  };

  componentDidMount() {
    const { onChange, defaultChecked } = this.props;
    onChange(defaultChecked);
  }

  render() {
    const {
      disabled, className, name, value, onChange, label, color,
    } = this.props;
    const CheckboxClass = classNames({
      'checkbox-btn': true,
      disabled,
    });

    return (
      <label
        className={`${CheckboxClass} ${className ? ` checkbox-btn--${className}` : ''}`}
        htmlFor={name}
      >
        <input
          className="checkbox-btn__checkbox"
          type="checkbox"
          id={name}
          name={name}
          onChange={onChange}
          checked={value}
          disabled={disabled}
        />
        <span
          className="checkbox-btn__checkbox-custom"
          style={color ? { background: color, borderColor: color } : {}}
        >
          <CheckIcon/>
        </span>
        {
          className === 'button'
            ? (
              <span className="checkbox-btn__label-svg">
                <CheckIcon className="checkbox-btn__label-check"/>
                <CloseIcon className="checkbox-btn__label-uncheck"/>
              </span>
            )
            : (
              ''
            )
        }
        <span className="checkbox-btn__label">
          {label}
        </span>
      </label>
    );
  }
}

const renderCheckBoxField = (props) => {
  const {
    input, label, defaultChecked, disabled, className, color,
  } = props;
  return (
    <CheckBoxField
      {...input}
      label={label}
      defaultChecked={
        props.meta.initial != null
          ? props.meta.initial
          : defaultChecked
      }
      disabled={disabled}
      className={className}
      color={color}
    />
  );
};

renderCheckBoxField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }).isRequired,
  label: PropTypes.string,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string,
};

renderCheckBoxField.defaultProps = {
  label: '',
  defaultChecked: false,
  disabled: false,
  className: '',
  color: '',
};

export default renderCheckBoxField;
