import React from 'react';
import { createPortal } from 'react-dom';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

/**
 * Helper component to show modal
 */
class Modal extends React.Component {
  constructor (props) {
    super(props);
    const appRoot = document.getElementById('root');

    this.el = appRoot.querySelector(this.props.elementId);

    if (!this.el) {
      this.el = document.createElement('div');
      this.el.id = 'chart-popover';
      appRoot.appendChild(this.el);
    }
  }

  componentWillUnmount () {
    this.el.remove();
  }

  render () {
    return createPortal(this.props.children, this.el);
  }
}

if (environment !== 'production') {
  Modal.propTypes = {
    children: T.object,
    elementId: T.string
  };
}

export default Modal;
