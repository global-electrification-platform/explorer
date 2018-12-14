import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';

import ShadowScrollbars from '../ShadowScrollbar';
import Legend from './Legend';

class Summary extends Component {
  render () {
    const { isReady, getData } = this.props.scenario;

    const scenario = getData();

    // Check if scenario is ready and contains features
    const summary = isReady() && Object.keys(scenario.layers).length > 0
      ? scenario.summary
      : {
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
            <Legend scenario={scenario} />
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
    scenario: T.object,
    model: T.object
  };
}

export default Summary;
