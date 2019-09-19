import React, { Component, Fragment } from 'react';
import { PropTypes as T } from 'prop-types';
import map from 'lodash.map';
import { Group } from '@vx/group';
import { AreaStack, Pie } from '@vx/shape';
import { scaleLinear } from '@vx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { localPoint } from '@vx/event';

import { environment } from '../../config';
import { formatKeyIndicator } from '../../utils';

import Modal from '../Modal';

/**
 * Labels and formatter for Key Indicators
 */
const indicatorsLabels = {
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
      popoverPosition: {},
      populationPopoverVisible: false
    };

    this.renderChart = this.renderChart.bind(this);
    this.renderPopulationChart = this.renderPopulationChart.bind(this);
    this.renderPopulationPopover = this.renderPopulationPopover.bind(this);
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
          <article
            className='popover popover--anchor-right'
            style={{ top: yAxis, right: right + 12 }}
          >
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
                          <span
                            className={`lgfx`}
                            style={{ backgroundColor: layer.color }}
                          >
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

  renderPopulationPopover () {
    const {
      popoverPosition: { yAxis, right },
      hoveredYearInPopChart: targetYear
    } = this.state;

    if (!targetYear) return null;

    const { model, techLayers, scenario } = this.props;

    // Object to store data to be used at popover
    const data = {};

    // Get years
    const {
      baseYear,
      timesteps: [intermediateYear]
    } = model;
    let baselineYear;

    // Get summaries
    const {
      summary: { popBaseYear, popIntermediateYear, popFinalYear },
      summaryByType: {
        popConnectedBaseYear,
        popConnectedIntermediateYear,
        popConnectedFinalYear
      }
    } = scenario;

    if (targetYear === baseYear) {
      data.popConnected = popConnectedBaseYear;
      data.popConnectedBaseline = {};
      data.pop = popBaseYear;
    } else if (targetYear === intermediateYear) {
      baselineYear = baseYear;
      data.popConnected = popConnectedIntermediateYear;
      data.popConnectedBaseline = popConnectedBaseYear;
      data.pop = popIntermediateYear;
    } else {
      baselineYear = intermediateYear;
      data.popConnected = popConnectedFinalYear;
      data.popConnectedBaseline = popConnectedIntermediateYear;
      data.pop = popFinalYear;
    }

    // Calculate diff per type from baseline year
    data.appliedTechTypes = Object.keys(data.popConnected);
    if (targetYear !== baseYear) {
      data.popConnectedDiff = data.appliedTechTypes.reduce((result, type) => {
        result[type] = data.popConnected[type]
          ? data.popConnected[type] - (data.popConnectedBaseline[type] || 0)
          : 0;
        return result;
      }, {});
    }

    // Calculate unconnected people
    data.popUnconnected =
      data.pop -
      Object.keys(data.popConnected).reduce((total, key) => {
        total += data.popConnected[key];
        return total;
      }, 0);

    return (
      <Modal elementId={'#chart-popover'}>
        <article
          className='popover popover--anchor-right'
          style={{ top: yAxis, right: right + 12 }}
        >
          <div className='popover__contents'>
            <header className='popover__header'>
              <div className='popover__headline'>
                <h1 className='popover__title'>Population connected</h1>
                <p className='popover__subtitle'>
                  In {targetYear}:{' '}
                  {formatKeyIndicator(data.pop - data.popUnconnected)} of{' '}
                  {formatKeyIndicator(data.pop)}
                </p>
              </div>
            </header>
            <div className='popover__body'>
              <dl className='chart-number-list'>
                {data.appliedTechTypes.map(layerId => {
                  const techLayer = techLayers.find(l => l.id === layerId);
                  return (
                    <Fragment key={layerId}>
                      <dt>
                        <span
                          className='lgfx'
                          style={{ backgroundColor: techLayer.color }}
                        >
                          {techLayer.label}
                        </span>
                      </dt>
                      <dd>
                        <span>
                          {formatKeyIndicator(data.popConnected[layerId])}
                        </span>
                        {targetYear !== baseYear && (
                          <small>
                            {data.popConnectedDiff[layerId] > 0 && '+'}
                            {formatKeyIndicator(
                              data.popConnectedDiff[layerId]
                            )}
                              *
                          </small>
                        )}
                      </dd>
                    </Fragment>
                  );
                })}
              </dl>
            </div>
            {baselineYear && (
              <footer className='popover__footer'>
                <p className='chart-note'>* added after {baselineYear}</p>
              </footer>
            )}
          </div>
        </article>
      </Modal>
    );
  }

  renderPopulationChart () {
    const { scenario, model, techLayers } = this.props;

    // Get summaries
    const {
      summary: { popBaseYear, popIntermediateYear, popFinalYear },
      summaryByType: {
        popConnectedBaseYear,
        popConnectedIntermediateYear,
        popConnectedFinalYear
      }
    } = scenario;

    // Get years
    const { baseYear, timesteps } = model;
    const [intermediateYear, finalYear] = timesteps;

    // Get tech types and colors
    const colors = techLayers.reduce((acc, l) => {
      acc[parseInt(l.id)] = l.color;
      return acc;
    }, {});
    const techTypes = Object.keys(colors);

    /*
     * Parse input data to object suitable to display, like this:
     *
     * let data = [{
     *   year: 2018,
     *   1: 10
     *   2: 32
     *   3: 5
     * }, {
     *   year: 2025,
     *   1: 12,
     *   2: 35
     *   3: 12
     * }, {
     *   year: 2030,
     *   1: 15,
     *   2: 40
     *   3: 22
     * }]
     */
    let data = [
      {
        year: baseYear,
        ...Object.keys(popConnectedBaseYear).reduce((summary, type) => {
          summary[type] = (popConnectedBaseYear[type] / popBaseYear) * 100;
          return summary;
        }, {})
      },
      {
        year: intermediateYear,
        ...Object.keys(popConnectedIntermediateYear).reduce((summary, type) => {
          summary[type] =
            (popConnectedIntermediateYear[type] / popIntermediateYear) * 100;
          return summary;
        }, {})
      },
      {
        year: finalYear,
        ...Object.keys(popConnectedFinalYear).reduce((summary, type) => {
          summary[type] = (popConnectedFinalYear[type] / popFinalYear) * 100;
          return summary;
        }, {})
      }
    ];

    // Fill undefined tech types with zero
    data = data.map(d => {
      techTypes.forEach(techType => {
        d[techType] = d[techType] || 0;
      });
      return d;
    });

    // Get years for ticks
    const years = data.map(d => d.year);

    // Chart properties
    const height = 150;
    const width = 200;
    const margin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    };
    const xMin = 30;
    const xMax = width - xMin;
    const yMin = height - margin.top - margin.bottom;
    const yMax = margin.top;
    const xTickLength = 6;
    const yTickLength = 4;

    // Define scales
    const xScale = scaleLinear({
      range: [xMin, xMax],
      domain: [Math.min(...years), Math.max(...years)]
    });
    const yScale = scaleLinear({
      range: [margin.top, yMin],
      domain: [100, 0]
    });

    // Define bisector function for years
    const yearsBisector = [
      (intermediateYear + baseYear) / 2,
      (finalYear + intermediateYear) / 2
    ];
    function nearestYear (y) {
      if (y < yearsBisector[0]) return baseYear;
      else if (y > yearsBisector[1]) return finalYear;
      else return intermediateYear;
    }

    return (
      <figure className='sum-chart-media'>
        <div className='sum-area-chart-media__item'>
          <svg width={width} height={height}>
            <Group>
              <AxisLeft
                left={xMin}
                scale={scaleLinear({
                  range: [yMin, yMax],
                  domain: [0, 100]
                })}
                tickComponent={({ formattedValue, ...tickProps }) => (
                  <text {...tickProps}>{formattedValue}%</text>
                )}
                className='y-axis'
                tickLabelProps={(value, index) => ({
                  textAnchor: 'end',
                  dx: '-0.25em',
                  dy: '0.25em'
                })}
                tickLength={yTickLength}
                numTicks={3}
              />
              <AreaStack
                top={margin.top}
                keys={techTypes}
                data={data}
                x={({ data }) => {
                  return xScale(data.year);
                }}
                y0={d => yScale(d[0])}
                y1={d => yScale(d[1])}
              >
                {area => {
                  const { stacks, path } = area;
                  return stacks.map(stack => {
                    return (
                      <path
                        key={`stack-${stack.key}`}
                        d={path(stack)}
                        stroke='transparent'
                        fill={colors[stack.key]}
                      />
                    );
                  });
                }}
              </AreaStack>
              <AxisBottom
                top={yMin}
                scale={xScale}
                data={data}
                hideAxisLine
                tickValues={years}
                tickFormat={d => d}
                tickLength={xTickLength}
              />
            </Group>
            <rect
              width={xMax - xMin}
              x={xMin}
              height={height}
              opacity={0}
              ref={ref => {
                this.chartHoverArea = ref;
              }}
              onMouseEnter={event => {
                const { target } = event;
                const { top, height, left } = target.getBoundingClientRect();
                const yAxis = top + height / 2;
                this.setState({
                  populationPopoverVisible: true,
                  popoverPosition: {
                    yAxis,
                    right: window.innerWidth - left
                  }
                });
              }}
              onMouseMove={event => {
                const x = localPoint(this.chartHoverArea, event).x + xMin;
                const hoveredYear = xScale.invert(x);
                this.setState({
                  hoveredYearInPopChart: nearestYear(hoveredYear)
                });
              }}
              // onMouseMove={getHoveredYear}
              onMouseLeave={() => {
                this.setState({
                  populationPopoverVisible: false
                });
              }}
            />
          </svg>
        </div>

        <figcaption className='sum-chart-media__caption'>
          {'Population connected'}
        </figcaption>
      </figure>
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
              {keyIndicator === 'peopleConnected' ? (
                <text className='values' y='0.125em'>
                  <tspan className='value--prime' x='0' textAnchor='middle'>
                    {format(summary[keyIndicator])}
                  </tspan>
                  <tspan
                    className='value--sub'
                    x='0'
                    textAnchor='middle'
                    dy='1.25em'
                  >
                    of {format(summary.totalPopulation)}
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
    const { populationPopoverVisible } = this.state;
    return (
      <Fragment>
        {this.renderPopover()}
        {populationPopoverVisible && this.renderPopulationPopover()}
        {this.renderPopulationChart()}
        {['investmentCost', 'newCapacity'].map(indicator => {
          return this.renderChart(indicator);
        })}
      </Fragment>
    );
  }
}

if (environment !== 'production') {
  Charts.propTypes = {
    appliedState: T.object,
    scenario: T.object,
    techLayers: T.array
  };
}

export default Charts;
