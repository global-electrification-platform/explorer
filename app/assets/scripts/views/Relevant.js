import React, { Component } from 'react';

import App from './App';

class Relevant extends Component {
  render () {
    return (
      <App pageTitle='Relevant'>
        <article className='inpage inpage--single inpage--related'>
          <header className='inpage__header'>
            <div className='inpage__subheader'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Relevant tools</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='prose'>
              <p>
                Other applications and data sources that are relevant for the energy sector.
              </p>
              <dl className='dl--horizontal'>
                <dt>
                  <a href='https://energydata.info' target='_blank'>
                    energydata.info
                  </a>
                </dt>
                <dd>
                  Open data and analytics for a sustainable energy future.
                </dd>
                <dt>
                  <a href='https://globalsolaratlas.info' target='_blank'>
                    Global Solar Atlas
                  </a>
                </dt>
                <dd>
                  Access to solar resource and photovoltaic power potential around the globe.
                </dd>
                <dt>
                  <a href='https://globalwindatlas.info/' target='_blank'>
                    Global Wind Atlas
                  </a>
                </dt>
                <dd>
                  Identify high-wind areas for wind power generation virtually anywhere in the world.
                </dd>
                <dt>
                  <a href='https://rise.esmap.org/' target='_blank'>
                    RISE
                  </a>
                </dt>
                <dd>
                  Regulatory Indicators for Sustainable Energy.
                </dd>
                <dt>
                  <a href='https://trackingsdg7.esmap.org/' target='_blank'>
                    Tracking SDG7
                  </a>
                </dt>
                <dd>
                  The Energy Progress Report.
                </dd>
              </dl>
            </div>
          </div>
        </article>
      </App>
    );
  }
}

export default Relevant;
