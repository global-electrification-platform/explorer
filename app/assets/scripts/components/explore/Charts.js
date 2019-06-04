import React, { Component, Fragment } from 'react';
import { PropTypes as T } from 'prop-types';
import map from 'lodash.map';
import { Group } from '@vx/group';
import { Pie } from '@vx/shape';

import { environment } from '../../config';
import { formatKeyIndicator } from '../../utils';

import Modal from '../Modal';

/**
 * Labels and formatter for Key Indicators
 */
const indicatorsLabels = {
  electrifiedPopulation: {
    label: 'People Affected',
    format: formatKeyIndicator
  },
  investmentCost: {
    label: 'Investment Required',
    format: n => {
      return `$${formatKeyIndicator(n, 'metric')}`;
    }
  },
  newCapacity: {
    label: 'Added Capacity',
    format: n => {
      return `${formatKeyIndicator(n, 'power')}`;
    }
  }
};

/**
 * The Chart component
 */
class Charts extends Component {
  constructor (props) {
    super(props);

    this.state = {
      popoverIsVisible: false,
      popoverPosition: {}
    };

    this.renderChart = this.renderChart.bind(this);
    this.renderPopover = this.renderPopover.bind(this);
    this.updatePopover = this.updatePopover.bind(this);
  }

  updatePopover (popoverIsVisible, keyIndicator) {
    this.setState({
      popoverIsVisible,
      keyIndicator
    });
  }

  renderPopover () {
    const {
      popoverIsVisible,
      popoverPosition: { yAxis, right },
      keyIndicator
    } = this.state;

    const summary = this.props.scenario.summaryByType[keyIndicator];
    const techLayers = this.props.techLayers;

    return (
      popoverIsVisible && (
        <Modal elementId={'#chart-popover'}>
          <article className='popover popover--anchor-right' style={{ top: yAxis, right: right + 12 }}>
            <div className='popover__contents'>
              <header className='popover__header'>
                <div className='popover__headline'>
                  <h1 className='popover__title'>
                    {indicatorsLabels[keyIndicator].label}
                  </h1>
                </div>
              </header>
              <div className='popover__body'>
                <dl className='chart-number-list'>
                  {Object.keys(summary).map(layerId => {
                    const { format } = indicatorsLabels[keyIndicator];
                    const layer = techLayers.filter(l => l.id === layerId)[0];
                    return (
                      <Fragment key={layerId}>
                        <dt>
                          <span className={`lgfx`} style={{ backgroundColor: layer.color }}>
                            {layer.label}
                          </span>
                        </dt>
                        <dd>{format(summary[layerId])}</dd>
                      </Fragment>
                    );
                  })}
                </dl>
              </div>
            </div>
          </article>
        </Modal>
      )
    );
  }

  renderChart (keyIndicator) {
    const { summary, summaryByType } = this.props.scenario;
    const techLayers = this.props.techLayers;
    const { label, format } = indicatorsLabels[keyIndicator];

    const height = 132;
    const padding = 2;
    const radius = (height - 2 * padding) / 2;
    const thickness = 16;

    const data = map(summaryByType[keyIndicator], (value, type) => {
      // Get layer configuration for type
      const layer = techLayers.filter(l => l.id === type)[0];
      return { value, type, layer };
    });

    return (
      <figure className='sum-chart-media' key={keyIndicator}>
        <div className='sum-chart-media__item'>
          <svg width={height} height={height}>
            <Group top={height / 2} left={height / 2}>
              {keyIndicator === 'electrifiedPopulation' ? (
                <text className='values' y='0.125em'>
                  <tspan className='value--prime' x='0' textAnchor='middle'>
                    {format(summary[keyIndicator])}
                  </tspan>
                  <tspan className='value--sub' x='0' textAnchor='middle' dy='1.25em'>
                    of 84 M
                  </tspan>
                </text>
              ) : (
                <text className='values' y='0.5em'>
                  <tspan className='value--prime' x='0' textAnchor='middle'>
                    {format(summary[keyIndicator])}
                  </tspan>
                </text>
              )}
              <Pie
                data={data}
                pieValue={d => d.value}
                fillOpacity={0.8}
                outerRadius={radius}
                innerRadius={radius - thickness}
              >
                {pie => {
                  return pie.arcs.map((arc, i) => {
                    return (
                      <g key={`letters-${arc.data.label}-${i}`}>
                        <path
                          className='slice'
                          d={pie.path(arc)}
                          fill={arc.data.layer.color}
                        />
                      </g>
                    );
                  });
                }}
              </Pie>
            </Group>
            <rect
              width={height}
              height={height}
              opacity={0}
              onMouseEnter={event => {
                const { target } = event;
                const { top, height, left } = target.getBoundingClientRect();
                const yAxis = top + height / 2;
                this.setState({
                  popoverIsVisible: true,
                  popoverPosition: {
                    yAxis,
                    right: window.innerWidth - left
                  },
                  keyIndicator
                });
              }}
              onMouseLeave={() => {
                this.setState({
                  popoverIsVisible: false,
                  keyIndicator: null
                });
              }}
            />
          </svg>
        </div>
        <figcaption className='sum-chart-media__caption'>{label}</figcaption>
      </figure>
    );
  }

  render () {
    return (
      <Fragment>
        {this.renderPopover()}
        {['electrifiedPopulation', 'investmentCost', 'newCapacity'].map(
          indicator => {
            return this.renderChart(indicator);
          }
        )}
      </Fragment>
    );
  }
}

if (environment !== 'production') {
  Charts.propTypes = {
    scenario: T.object,
    techLayers: T.array
  };
}

export default Charts;
