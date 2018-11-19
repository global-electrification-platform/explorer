import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { NavLink } from 'react-router-dom';

import { environment } from '../config';

export default class NavGlobalMenu extends Component {
  renderHeaderMenu () {
    return (
      <ul className='global-menu'>
        <li>
          <NavLink
            exact
            to='/'
            title='View page'
            activeClassName='global-menu__link--active'
            className='global-menu__link global-menu__link--home'
          >
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/explore'
            title='View page'
            activeClassName='global-menu__link--active'
            className='global-menu__link global-menu__link--explore'
          >
            <span>Explore</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/docs'
            title='View page'
            activeClassName='global-menu__link--active'
            className='global-menu__link global-menu__link--docs'
          >
            <span>Documentation</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/about'
            title='View page'
            activeClassName='global-menu__link--active'
            className='global-menu__link global-menu__link--about'
          >
            <span>About</span>
          </NavLink>
        </li>
        <li>
          <a
            href='#'
            title='View page'
            className='global-menu__link global-menu__link--share disabled'
          >
            <span>Share</span>
          </a>
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
