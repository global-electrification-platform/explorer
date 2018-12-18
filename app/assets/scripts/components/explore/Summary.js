import React, { Component, Fragment } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';

import ShadowScrollbars from '../ShadowScrollbar';
import Charts from './Charts';
import Legend from './Legend';

class Summary extends Component {
  render () {
    const { isReady, getData } = this.props.scenario;

    return (
      <section className='exp-summary'>
        <header className='exp-summary__header'>
          <div className='exp-summary__headline'>
            <h1 className='exp-summary__title'>Summary</h1>
          </div>
        </header>
        <div className='exp-summary__body'>
          <ShadowScrollbars theme='light'>
            {isReady() && (
            <Fragment>
              <Legend scenario={getData()} />
              <div className='sum-block sum-block--charts'>
                <h2 className='sum-block__title'>Charts</h2>
                <Charts scenario={getData()} />
              </div>
            </Fragment>
            )}
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
