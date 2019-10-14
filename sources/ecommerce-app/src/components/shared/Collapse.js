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

import React, { PureComponent } from 'react';
import { Collapse } from 'reactstrap';
import PropTypes from 'prop-types';
import MinusIcon from 'mdi-react/MinusIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';

export default class CollapseComponent extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.element.isRequired,
  };

  static defaultProps = {
    title: '',
    className: '',
  };

  constructor() {
    super();
    this.state = {
      collapse: false,
      status: 'closed',
      icon: <PlusIcon />,
    };
  }

  onEntering = () => {
    this.setState({ status: 'opening', icon: <MinusIcon /> });
  };

  onEntered = () => {
    this.setState({ status: 'opened', icon: <MinusIcon /> });
  };

  onExiting = () => {
    this.setState({ status: 'closing', icon: <PlusIcon /> });
  };

  onExited = () => {
    this.setState({ status: 'closed', icon: <PlusIcon /> });
  };

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  render() {
    const { className, title, children } = this.props;
    const { icon, collapse, status } = this.state;

    return (
      <div className={`collapse__wrapper ${status} ${className}`}>
        <button onClick={this.toggle} className="collapse__title" type="button">
          {icon}
          <p>{title}<ChevronDownIcon /></p>
        </button>
        <Collapse
          isOpen={collapse}
          className="collapse__content"
          onEntering={this.onEntering}
          onEntered={this.onEntered}
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <div>
            {children}
          </div>
        </Collapse>
      </div>
    );
  }
}
