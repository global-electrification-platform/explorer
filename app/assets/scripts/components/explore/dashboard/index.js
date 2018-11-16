import React, { Component } from 'react';

import Layers from './Layers';
import Levers from './Levers';
import Filters from './Filters';

class Explore extends Component {
  render () {
    return (
      <div className='econtrols'>
        <nav className='nav'>
          <ul className='nav__tablist' role='tablist'>
            <li className='nav__tab' role='presentation'>
              <a href='#econtrols-scenarios' className='nav__link nav__link--active' title='View options' role='tab'><span>Scenarios</span></a>
            </li>
            <li className='nav__tab' role='presentation'>
              <a href='#econtrols-filters' className='nav__link' title='View options' role='tab'><span>Filters</span></a>
            </li>
            <li className='nav__tab' role='presentation'>
              <a href='#econtrols-layers' className='nav__link' title='View options' role='tab'><span>Layers</span></a>
            </li>
          </ul>
        </nav>
        <Levers />
        <Filters />
        <Layers />
      </div>
    );
  }
}

export default Explore;
