import React, { Component } from 'react';

class Explore extends Component {
  render () {
    return (
      <section className='exp-summary'>
        <header className='exp-summary__header'>
          <div className='exp-summary__headline'>
            <h1 className='exp-summary__title'>Summary</h1>
          </div>
          <div className='exp-summary__hactions'>
            <button
              type='button'
              className='button button--small button--primary-raised-dark'
              title='Download the data'
            >
              <span>Export</span>
            </button>
          </div>
        </header>
        <div className='exp-summary__body'>
          <div className='mapkey'>
            <h2>Map key</h2>
            <ul>
              <li>Grid</li>
              <li>Stand Alone Diesel</li>
              <li>Stand Alone PV</li>
              <li>Mini-grid</li>
            </ul>
          </div>
          <br />
          <div className='charts'>
            <h2>Charts</h2>
            <div className='chart'>Chart 1</div>
            <div className='chart'>Chart 2</div>
            <div className='chart'>Chart 3</div>
          </div>
          <br />
          <div className='summary'>
            <h2>Summary</h2>
            <h3>Population Electrified</h3>
            <p>1 280 848</p>
            <h3>Investiment Required</h3>
            <p>$94 999 393</p>
            <h3>Capacity Added</h3>
            <p>65 GWh</p>
          </div>
        </div>
      </section>
    );
  }
}

export default Explore;
