'use strict'
import React from 'react'
import { PropTypes as T } from 'prop-types'
import elementResizeEvent from 'element-resize-event'
import css from 'dom-css'
import { Scrollbars } from 'react-custom-scrollbars'

/**
 * Gets the height of a given element removing paddings.
 * @param {HTML node} el The element to get the height for.
 */
const getInnerHeight = el => {
  const { clientHeight } = el;
  const { paddingTop, paddingBottom } = getComputedStyle(el);
  return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
};

export default class ShadowScrollbars extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      height: 0
    }

    this._theParent = null
    // Bindings.
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  handleUpdate (values) {
    const { shadowTop, shadowBottom } = this.refs
    const { scrollTop, scrollHeight, clientHeight } = values
    const shadowTopOpacity = 1 / 20 * Math.min(scrollTop, 20)
    const bottomScrollTop = scrollHeight - clientHeight
    const shadowBottomOpacity = 1 / 20 * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20))
    css(shadowTop, { opacity: shadowTopOpacity })
    css(shadowBottom, { opacity: shadowBottomOpacity })
  }

  updateHeight () {
    const height = getInnerHeight(this._theParent);
    this.setState({ height });
  }

  componentDidMount () {
    // Add listener on next tick because it was messing up css transitions.
    // Particularly in the dropdown.
    setTimeout(() => {
      if (!this._theParent) return;
      elementResizeEvent(this._theParent, () => this.updateHeight());
      // First update.
      this.updateHeight();
    }, 1);
  }

  renderThumb ({ style, ...props }) {
    return (
      <div className='rcs__bar' style={style} {...props}/>
    )
  }

  render () {
    const containerStyle = {
      height: this.state.height,
      width: '100%',
      position: 'relative'
    }

    const {theme, ...rest} = this.props

    return (
      <div className={`rcs rcs--${theme}`} style={containerStyle} ref={el => (this._theParent = el ? el.parentElement : null)}>
        <Scrollbars
          ref='scrollbars'
          onUpdate={this.handleUpdate}
          renderThumbHorizontal={this.renderThumb}
          renderThumbVertical={this.renderThumb}
          style={{height: this.state.height}}
          {...rest}/>
        <div ref='shadowTop' className='rcs__shadow rcs__shadow--top' />
        <div ref='shadowBottom' className='rcs__shadow rcs__shadow--bottom' />
      </div>
    )
  }
}

ShadowScrollbars.propTypes = {
  theme: T.string
}
