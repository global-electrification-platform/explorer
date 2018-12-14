'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import elementResizeEvent from 'element-resize-event';

import { environment } from '../config';
import { objForeach } from '../utils';

export const RANGE_MATRIX = {
  xsmall: [0, 543],
  small: [544, 767],
  medium: [768, 991],
  large: [992, 1199],
  xlarge: [1200, Infinity]
}

class Breakpoint extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getBreakpoints()

    this.resizeListener = this.resizeListener.bind(this)
  }

  getBreakpoints () {
    const width = document.body.offsetWidth
    let ranges = {}
    objForeach(RANGE_MATRIX, ([min, max], name) => {
      ranges[`${name}Down`] = width <= max
      ranges[`${name}Only`] = width >= min && width <= max
      ranges[`${name}Up`] = width >= min
    })

    return ranges
  }

  resizeListener () {
    this.setState(this.getBreakpoints())
  }

  componentDidMount () {
    elementResizeEvent(document.body, this.resizeListener)
  }

  componentWillUnmount () {
    elementResizeEvent.unbind(document.body, this.resizeListener)
  }

  render () {
    return this.props.children(this.state)
  }
}

if (environment !== 'production') {
  Breakpoint.propTypes = {
    children: T.func.isRequired
  }
}

export default Breakpoint;
