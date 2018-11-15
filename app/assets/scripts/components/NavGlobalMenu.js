import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

import { environment } from '../config';

export default class NavGlobalMenu extends Component {
  renderHeaderMenu () {
    return (
      <ul className='global-menu' id='global-menu'>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/select-country'>Select Country</Link>
        </li>
        <li>
          <Link to='/select-model'>Select Model</Link>
        </li>
        <li>
          <Link to='/explore'>Explore Dashboard</Link>
        </li>
        <li>
          <Link to='/docs'>Docs</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
      </ul>
    );
  }

  renderFooterMenu () {
    return <ul />;
  }

  render () {
    const { forHeader, forFooter } = this.props;
    if (forHeader) return this.renderHeaderMenu();
    if (forFooter) return this.renderFooterMenu();
    return null;
  }
}

if (environment !== 'production') {
  NavGlobalMenu.propTypes = {
    forHeader: T.bool,
    forFooter: T.bool
  };
}
