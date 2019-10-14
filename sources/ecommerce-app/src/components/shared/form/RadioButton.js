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
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

export function RadioButton(props) {
  const {
    name,
    label,
    value,
    disabled,
    onChange,
    className,
    currentValue
  } = props;
  const classes = classNames({
    disabled,
    'radio-btn': true,
    [`radio-btn--${className}`]: !!className
  });
  return (
    <label className={classes}>
      <input
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        checked={value === currentValue}
        className="radio-btn__radio"
      />
      <span className="radio-btn__radio-custom"/>
      {className === 'button' ? (
        <span className="radio-btn__label-svg">
          <CheckIcon className="radio-btn__label-check"/>
          <CloseIcon className="radio-btn__label-uncheck"/>
        </span>
      ) : ''}
      <span className="radio-btn__label">{label}</span>
    </label>
  );
}

export class RadioButtonField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    defaultChecked: PropTypes.bool,
    radioValue: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    label: '',
    defaultChecked: false,
    radioValue: '',
    disabled: false,
    className: '',
  };

  componentDidMount() {
    const { defaultChecked, onChange, radioValue } = this.props;
    if (defaultChecked) {
      onChange(radioValue);
    }
  }

  onChange = () => {
    const { onChange, radioValue } = this.props;
    onChange(radioValue);
  };

  render() {
    const {
      disabled, className, name, label, radioValue, value,
    } = this.props;
    const RadioButtonClass = classNames({
      'radio-btn': true,
      disabled,
    });

    return (
      <label
        className={`${RadioButtonClass}${className ? ` radio-btn--${className}` : ''}`}
      >
        <input
          className="radio-btn__radio"
          name={name}
          type="radio"
          onChange={this.onChange}
          checked={value === radioValue}
          disabled={disabled}
        />
        <span className="radio-btn__radio-custom"/>
        {className === 'button'
          ? (
            <span className="radio-btn__label-svg">
              <CheckIcon className="radio-btn__label-check"/>
              <CloseIcon className="radio-btn__label-uncheck"/>
            </span>
          ) : ''}
        <span className="radio-btn__label">{label}</span>
      </label>
    );
  }
}

const renderRadioButtonField = (props) => {
  const {
    input, label, defaultChecked, disabled, className, radioValue,
  } = props;
  return (
    <RadioButtonField
      {...input}
      label={label}
      defaultChecked={defaultChecked}
      disabled={disabled}
      radioValue={radioValue}
      className={className}
    />
  );
};

renderRadioButtonField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  radioValue: PropTypes.string,
  className: PropTypes.string,
};

renderRadioButtonField.defaultProps = {
  label: '',
  defaultChecked: false,
  disabled: false,
  radioValue: '',
  className: '',
};

export default renderRadioButtonField;
