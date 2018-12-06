import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';

import ShadowScrollbars from '../ShadowScrollbar';

class Summary extends Component {
  render () {
    const summary = this.props.scenario.summary || {
      investmentCost: '-',
      newCapacity: '-',
      electrifiedPopulation: '-'
    };

    return (
      <section className='exp-summary'>
        <header className='exp-summary__header'>
          <div className='exp-summary__headline'>
            <h1 className='exp-summary__title'>Summary</h1>
          </div>
        </header>
        <div className='exp-summary__body'>
          <ShadowScrollbars theme='light'>
            <div className='sum-block'>
              <h2 className='sum-block__title'>Legend</h2>
              <dl className='legend-list'>
                <dt className='lgfx lgfx--alpha'>Red</dt>
                <dd>Grid</dd>
                <dt className='lgfx lgfx--beta'>Blue</dt>
                <dd>Stand alone diesel</dd>
                <dt className='lgfx lgfx--gama'>Yellow</dt>
                <dd>Stand alone PV</dd>
                <dt className='lgfx lgfx--delta'>Green</dt>
                <dd>Mini-grid</dd>
              </dl>
            </div>

            <div className='sum-block'>
              <h2 className='sum-block__title'>Charts</h2>
              <div className='chart'>Chart 1</div>
              <div className='chart'>Chart 2</div>
              <div className='chart'>Chart 3</div>
            </div>

            <div className='sum-block'>
              <h2 className='sum-block__title'>Aggregated numbers</h2>
              <dl className='sum-number-list'>
                <dt>Population Electrified</dt>
                <dd>{summary.electrifiedPopulation}</dd>
                <dt>Investment Required</dt>
                <dd>{summary.investmentCost}</dd>
                <dt>Capacity Added</dt>
                <dd>{summary.newCapacity}</dd>
              </dl>
            </div>
          </ShadowScrollbars>
        </div>
        <footer className='exp-summary__footer'>
          <button
            type='button'
            className='exp-download-button disabled'
            title='Download the data'
          >
            <span>Export</span>
          </button>
        </footer>
      </section>
    );
  }
}

if (environment !== 'production') {
  Summary.propTypes = {
    scenario: T.object
  };
}

export default Summary;
