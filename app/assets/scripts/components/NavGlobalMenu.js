import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

import { environment } from '../config';

export default class NavGlobalMenu extends Component {
  renderHeaderMenu () {
    return (
      <ul className='global-menu'>
        <li>
          <Link to='/' title='View page' className='global-menu__link global-menu__link--home'><span>Home</span></Link>
        </li>
        <li>
          <Link to='/explore' title='View page' className='global-menu__link global-menu__link--explore'><span>Explore</span></Link>
        </li>
        <li>
          <Link to='/docs' title='View page' className='global-menu__link global-menu__link--docs'><span>Documentation</span></Link>
        </li>
        <li>
          <Link to='/about' title='View page' className='global-menu__link global-menu__link--about'><span>About</span></Link>
        </li>
        <li>
          <a href='#' title='View page' className='global-menu__link global-menu__link--share'><span>Share</span></a>
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
