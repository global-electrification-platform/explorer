import React, { Component, Fragment } from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { environment } from '../../config';

import ShadowScrollbars from '../ShadowScrollbar';
import Charts from './Charts';
import downloadPDF from './Download';
import Legend from './Legend';
import Dropdown from '../Dropdown';

class Summary extends Component {
  /**
   * Check if scenario has data and render panel accordingly
   */
  renderPanel () {
    const { appliedState, model, scenario } = this.props;
    const {
      map: { techLayersConfig }
    } = model;

    const { isReady, hasError, getData } = scenario;

    if (isReady() && !hasError()) {
      const scenario = getData();
      if (Object.keys(scenario.layers).length > 0) {
        return (
          <Fragment>
            <Legend scenario={scenario} techLayers={techLayersConfig} />
            <div className='sum-block sum-block--charts'>
              <h2 className='sum-block__title'>Charts</h2>
              <Charts
                appliedState={appliedState}
                model={model}
                scenario={scenario}
                techLayers={techLayersConfig}
              />
            </div>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <div className='sum-block sum-block--message'>
              <h2 className='sum-block__title'>Scenario not found</h2>
              <p>
                No data is available for this scenario. Please choose a
                different set of levers.
              </p>
            </div>
          </Fragment>
        );
      }
    } else {
      return hasError() ? (
        <Fragment>
          <div className='sum-block sum-block--message sum-block--error'>
            <h2>Error</h2>
            <p>An error occurred getting the data.</p>
            <p>Please try again.</p>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className='sum-block sum-block--message'>
            <h2 className='sum-block__title'>Loading</h2>
            <p>Fetching data for scenario...</p>
          </div>
        </Fragment>
      );
    }
  }

  render () {
    const { model } = this.props;

    return (
      <section className='exp-summary'>
        <header className='exp-summary__header'>
          <div className='exp-summary__headline'>
            <h1 className='exp-summary__title'>Summary</h1>
            <p className='exp-summary__subtitle'>
              Results for {this.props.appliedState.year}
            </p>
          </div>
        </header>
        <div className='exp-summary__body'>
          <ShadowScrollbars theme='light'>
            {this.renderPanel()}
          </ShadowScrollbars>
        </div>
        <footer className='exp-summary__footer'>
          <Dropdown
            triggerClassName='exp-download-button'
            triggerActiveClassName='button--active'
            triggerText='Download'
            triggerTitle='Download the data'
            direction='up'
            alignment='center'
          >
            <ul className='drop__menu drop__menu--iconified'>
              <li>
                <a
                  href='#'
                  className='drop__menu-item drop__menu-item--pdf'
                  data-hook='dropdown:close'
                  onClick={e => {
                    e.preventDefault();
                    downloadPDF(this.props);
                  }}
                >
                  PDF Report
                </a>
              </li>
              <li>
                <a
                  href={model.sourceData && model.sourceData.clusters}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={c('drop__menu-item drop__menu-item--shapefile',
                    { disabled: !model.sourceData || !model.sourceData.clusters }
                  )}
                  data-hook='dropdown:close'
                >
                  Country clusters
                </a>
              </li>
              <li>
                <a
                  href={model.sourceData && model.sourceData.scenarios}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={c('drop__menu-item drop__menu-item--data',
                    { disabled: !model.sourceData || !model.sourceData.scenarios }
                  )}
                  data-hook='dropdown:close'
                >
                  Full scenario data
                </a>
              </li>
            </ul>
          </Dropdown>
        </footer>
      </section>
    );
  }
}

if (environment !== 'production') {
  Summary.propTypes = {
    country: T.object,
    model: T.object,
    scenario: T.object,
    defaultFilters: T.array,
    leversState: T.array,
    filtersState: T.array,
    appliedState: T.object
  };
}

export default Summary;
