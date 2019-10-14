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

/* eslint-disable prefer-destructuring */
import 'rc-slider/assets/index.css';
import React, { PureComponent } from 'react';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export default class RangeTheme extends PureComponent {
  static propTypes = {
    marks: PropTypes.shape(),
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    tipFormatter: PropTypes.func,
  };

  static defaultProps = {
    marks: {},
    tipFormatter: value => value,
    tipOptions: {visible: true}
  };

  render() {
    const {
      min,
      max,
      marks,
      value,
      tipFormatter,
      tipOptions,
      onChange,
      onAfterChange
    } = this.props;

    return (
      <div className="slider">
        <div className="slider__min">
          <p>{tipFormatter ? tipFormatter(min) : min}</p>
        </div>
        <div className="slider__max">
          <p>{tipFormatter ? tipFormatter(max) : max}</p>
        </div>
        <Range
          min={min}
          max={max}
          defaultValue={value}
          tipFormatter={tipFormatter}
          marks={marks}
          tipProps={tipOptions}
          onAfterChange={onAfterChange}
          onChange={onChange}
        />
      </div>
    );
  }
}
