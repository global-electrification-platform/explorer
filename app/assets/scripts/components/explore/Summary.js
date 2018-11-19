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
              className='button button--small button--primary-raised-dark disabled'
              title='Download the data'
            >
              <span>Export</span>
            </button>
          </div>
        </header>
        <div className='exp-summary__body'>
          <div className='mapkey'>
            <h6>Map key</h6>
            <ul>
              <li>Grid</li>
              <li>Stand Alone Diesel</li>
              <li>Stand Alone PV</li>
              <li>Mini-grid</li>
            </ul>
          </div>
          <div className='charts'>
            <h6>Charts</h6>
            <div className='chart'>Chart 1</div>
            <div className='chart'>Chart 2</div>
            <div className='chart'>Chart 3</div>
          </div>
          <br />
          <div className='summary'>
            <h6>Aggregated numbers</h6>
            <dl>
              <dt>Population Electrified</dt>
              <dd>1 280 848</dd>
              <dt>Investiment Required</dt>
              <dd>$94 999 393</dd>
              <dt>Capacity Added</dt>
              <dd>65 GWh</dd>
            </dl>
          </div>
        </div>
      </section>
    );
  }
}

export default Explore;
