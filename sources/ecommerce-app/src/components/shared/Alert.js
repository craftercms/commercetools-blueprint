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

import React, { PureComponent } from 'react';
import { Alert as AlertReactstrap } from 'reactstrap';
import PropTypes from 'prop-types';
import InformationOutlineIcon from 'mdi-react/InformationOutlineIcon';
import ThumbUpOutlineIcon from 'mdi-react/ThumbUpOutlineIcon';
import CommentAlertOutlineIcon from 'mdi-react/CommentAlertOutlineIcon';
import CloseCircleOutlineIcon from 'mdi-react/CloseCircleOutlineIcon';

class Alert extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    icon: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.element.isRequired,
  };

  static defaultProps = {
    color: '',
    icon: false,
    className: '',
    dismiss: true,
    onDismiss: () => void null
  };

  constructor() {
    super();

    this.state = {
      visible: true,
    };
  }

  onShow = () => {
    this.setState({ visible: true });
  };

  onDismiss = () => {
    this.setState({ visible: false });
    this.props.onDismiss()
  };

  render() {
    const { visible } = this.state;

    const {
      color,
      className,
      icon,
      children,
      dismiss
    } = this.props;
    let Icon;

    switch (color) {
      case 'info':
        Icon = <InformationOutlineIcon />;
        break;
      case 'success':
        Icon = <ThumbUpOutlineIcon />;
        break;
      case 'warning':
        Icon = <CommentAlertOutlineIcon />;
        break;
      case 'danger':
        Icon = <CloseCircleOutlineIcon />;
        break;
      default:
        break;
    }

    if (visible) {
      return (
        <AlertReactstrap color={color} className={className} isOpen={visible}>
          {icon && <div className="alert__icon">{Icon}</div>}
          {dismiss && <button className="close" type="button" onClick={this.onDismiss}><span className="lnr lnr-cross" /></button>}
          <div className="alert__content">
            {children}
          </div>
        </AlertReactstrap>
      );
    }

    return null;

  }
}

export default Alert;
