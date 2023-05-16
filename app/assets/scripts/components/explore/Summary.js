import React, { Component, Fragment } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';

import ShadowScrollbars from '../ShadowScrollbar';
import Charts from './Charts';
import downloadPDF from './Download';
import Legend from './Legend';
import Dropdown from '../Dropdown';
import { Group } from '@vx/group';
import Modal from '../Modal';

class Summary extends Component {
  constructor() {
    super();
    this.state = {
      renewablePopoverIsVisible: false,
    }
  }
  renderRenewableChart(proportion) {
    const width = 200;
    const height = 25;
    const sumKey = (l, key) => l.reduce((x, y) => x + (y[key] || 0), 0)
    const data = [
      { value: proportion, color: '#aea' },
      { value: 1 - proportion, color: '#010' }
    ]
    return <Fragment>
     <figure className='sum-chart-media' style={{ paddingTop: '1rem', marginBottom: '0rem' }}>
        <div className='sum-chart-media__item'>
          <svg width={width} height={height}>
            <Group
                onMouseMove={event => {
                  const { target } = event;
                  const { top, height, left } = target.getBoundingClientRect();
                  const yAxis = top + height / 2;
                  const padding = 5;
                  this.setState({
                    renewablePopoverIsVisible: true,
                    popoverPosition: {
                      yAxis,
                      right: window.innerWidth - (left - padding)
                    },
                    renewablePopoverProportion: proportion,
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    renewablePopoverIsVisible: false,
                  });
                }}
              >
              {data.map((elem, idx) => <rect
                key={idx}
                x={sumKey(data.slice(0, idx), 'value') * width}
                y={0}
                width={elem.value * width}
                height={25}
                fill={elem.color}
                onClick={() => {
                  // pass
                }}
                
              >
              </rect>)}
              <text
                y={height / 2}
                x={proportion < 0.25 ? (proportion * width) + 5 : 5}
                style={{ 
                  fill: proportion < 0.25 ? "#aea" : "#010",
                  fontSize: '14px',
                }}
                dominantBaseline="central"
              >
                {(proportion * 100).toFixed(1)}%
              </text>
            </Group>
          </svg>
        </div>
        <figcaption className='sum-chart-media__caption'>Renewable Energy Proportion</figcaption>
      </figure>

      </Fragment>;
  }
  renderRenewablePopover() {
    if (!this.state.renewablePopoverIsVisible) return;
    const {
      popoverPosition: { yAxis, right } = {},
      renewablePopoverProportion,
    } = this.state;

    return (
        <Modal elementId={'#chart-popover'}>
          <article
            className='popover popover--anchor-right'
            style={{ top: yAxis, right: right + 12 }}
          >
            <div className='popover__contents'>
              <header className='popover__header'>
                <div className='popover__headline'>
                  <h1 className='popover__title'>
                    Renewable Energy Proportion
                  </h1>
                </div>
              </header>
              <div className='popover__body'>
                <dl className="chart-number-list">
                  <dt>
                    <span
                      className={`lgfx`}
                      style={{ backgroundColor: '#aea' }}
                    >
                      Renewables
                    </span>
                  </dt>
                  <dd>
                    Renewable
                    <span style={{ marginLeft: 'auto' }}>
                      {(renewablePopoverProportion * 100).toFixed(1)}%
                    </span>
                  </dd>
                  <dt>
                    <span
                      className={`lgfx`}
                      style={{ backgroundColor: '#010' }}
                    >
                      Non-Renewables
                    </span>
                  </dt>
                  <dd>
                    Non-Renewable
                    <span style={{ marginLeft: 'auto' }}>
                      {((1 - renewablePopoverProportion) * 100).toFixed(1)}%
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </article>
        </Modal>
      )
  }
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
        const renewable = scenario.summaryByType.renewableEnergy[appliedState.year];
        return (
          <Fragment>
            {this.renderRenewableChart(renewable.renewable / renewable.total)}
            {this.renderRenewablePopover()}
            <hr />
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
            {model.disclaimer &&
              <p className='exp-summary__disclaimer'>
                {model.disclaimer}
              </p>
            }
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
              {model.sourceData &&
                model.sourceData.scenarios && (
                <li>
                  <a
                    href={model.sourceData.scenarios}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='drop__menu-item drop__menu-item--data'
                    data-hook='dropdown:close'
                  >
                      Source Data
                  </a>
                </li>
              )}
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
