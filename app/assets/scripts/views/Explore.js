import React, { Component } from 'react';

import Dashboard from '../components/explore/dashboard';
import Map from '../components/explore/Map';
import Summary from '../components/explore/Summary';

class Explore extends Component {
  render () {
    return (
      <section className='inpage inpage--explore'>
        <header className='inpage__header'>
          <div class='inpage__subheader'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Explore</h1>
              <h2 className='inpage__sectitle'>Country name</h2>
              <p className='inpage__subtitle'>OnSSET v2.1</p>
            </div>
            <div className='inpage__hactions'>
              <button type='button' className='button button--small button--primary-raised-light' title='Change country and model'><span>Change</span></button>
            </div>
          </div>
          <Dashboard />
        </header>
        <div className='inpage__body'>
          <Map />
          <Summary />
        </div>
      </section>
    );
  }
}

export default Explore;
