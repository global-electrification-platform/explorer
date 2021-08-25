import React, { Component, Fragment } from 'react';
import { PropTypes as T } from 'prop-types';
import map from 'lodash.map';
import { Group } from '@vx/group';
import { AreaStack, Pie, BarStackHorizontal } from '@vx/shape';
import { scaleLinear, scaleOrdinal, scaleBand } from '@vx/scale';
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
      popoverData,
      keyIndicator
    } = this.state;

    const summary = popoverData;
    const techLayers = this.props.techLayers;

    const getTotal = () => {
      const { format } = indicatorsLabels[keyIndicator];
      let values = Object.keys(popoverData).map((key, idx) => {
        if (key !== "year") {
          return popoverData[key];
        }
        return 0;
      });
      const total = values.reduce((a, b) => a+b);
      return format(total);
    };

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
                  <p className='popover__subtitle'>
                    Total: {getTotal()} in {popoverData.year}
                  </p>
                </div>
              </header>
              <div className='popover__body'>
                <dl className='chart-number-list'>
                  {Object.keys(popoverData).map(layerId => {
                    if (layerId !== 'year') {
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
                    }
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
                  {formatKeyIndicator(
                    data.pop - data.popUnconnected,
                    'metric',
                    1
                  )}{' '}
                  of {formatKeyIndicator(data.pop, 'metric', 1)}
                </p>
              </div>
            </header>
            <div className='popover__body'>
              <dl className='chart-number-list'>
                {data.appliedTechTypes.map(layerId => {
                  const techLayer = techLayers.find(l => l.id === layerId);

                  // Add tech type if there is people connected or difference
                  // between steps.
                  return (
                    (data.popConnected[layerId] !== 0 ||
                      (data.popConnectedDiff &&
                        data.popConnectedDiff[layerId] !== 0)) && (
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
                            {formatKeyIndicator(
                              data.popConnected[layerId],
                              'metric',
                              1
                            )}
                          </span>
                          {targetYear !== baseYear && (
                            <small>
                              {data.popConnectedDiff[layerId] > 0 && '+'}
                              {formatKeyIndicator(
                                data.popConnectedDiff[layerId],
                                'metric',
                                1
                              )}
                              *
                            </small>
                          )}
                        </dd>
                      </Fragment>
                    )
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
    const width = 220;
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

    function getBaselineSVG () {
      // Objet "data" has percentages per type and year. The following
      // accumulates percentages from the first year.
      const popBaseYearPercentage = Object.keys(data[0]).reduce((acc, i) => {
        if (i !== 'year') acc = acc + data[0][i];
        return acc;
      }, 0);
      return (
        <line
          x1={xMin}
          y1={yScale(popBaseYearPercentage)}
          x2={xMax}
          y2={yScale(popBaseYearPercentage)}
          stroke='black'
          strokeDasharray='2 1 2'
        />
      );
    }

    // Get document body color which varies depending on the theme
    var labelAndTicksColor = getComputedStyle(document.body).color;

    return (
      <figure className='sum-chart-media'>
        <div className='sum-area-chart-media__item'>
          <svg width={width} height={height}>
            <Group>
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
                  dy: '0.25em',
                  fill: labelAndTicksColor,
                })}
                tickLength={yTickLength}
                numTicks={3}
                tickStroke={labelAndTicksColor}
                stroke={labelAndTicksColor}
              />
              {getBaselineSVG()}
              <AxisBottom
                top={yMin}
                scale={xScale}
                data={data}
                hideAxisLine
                tickValues={years}
                tickFormat={d => d}
                tickLength={xTickLength}
                tickStroke={labelAndTicksColor}
                tickLabelProps={(value, index) => ({
                  fill: labelAndTicksColor,
                  fontSize: 8,
                })}
                stroke={labelAndTicksColor}
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

    const height = 150;
    const width = 200;
    const margin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    };
    const padding = 5;
    const xMin = 30;
    const xMax = width - xMin;
    const yMin = height - margin.top - margin.bottom;
    const yMax = margin.top;
    const xTickLength = 6;
    const yTickLength = 6;

    const years = Object.keys(summaryByType[keyIndicator]);
    years.sort();

    // categories of the bar
    let _barCategories = Object.keys(summaryByType[keyIndicator]).map(yr => {
      return Object.keys(summaryByType[keyIndicator][yr]);
    });
    const barCategories= Array.from(new Set(_barCategories.flat()));

    // Prepare Data
    const prepareData = (year) => {
      var _data = {
        year: parseInt(year)
      };
      barCategories.map(key => {
        _data[key] = summaryByType[keyIndicator][year][key] || 0;
      });
      return _data;
    };
    let data = years.map(value => {return prepareData(value);});

    // Chart colors and color scale and chart keys
    const chartColors = [];
    const chartKeys = [];
    Object.keys(data[0]).map(k => {
      if (k !== 'year') {
        chartColors.push(techLayers.filter(l => l.id === k)[0].color);
        chartKeys.push(k);
      }
    });
    const colorScale = scaleOrdinal({
      domain: chartKeys,
      range: chartColors
    });

    // Total Values
    const valueTotals = data.reduce((allTotals, currentYear) => {
      const totalValue = chartKeys.reduce((dailyTotal, k) => {
        dailyTotal += Number(currentYear[k]);
        return dailyTotal;
      }, 0);
      allTotals.push(totalValue);
      return allTotals;
    }, []);

    // chart scales and year
    const getYear = (d) => d.year;
    const yearScale = scaleBand({
      domain: data.map(getYear),
      range: [yMin, 0],
      padding: 0.4
    });
    const valueScale = scaleLinear({
      domain: [0, Math.max(...valueTotals)],
      range: [0, xMax],
      nice: true
    });

    // Get document body color which varies depending on the theme
    var labelAndTicksColor = getComputedStyle(document.body).color;

    return (
      <figure className='sum-chart-media' key={keyIndicator}>
        <div className='sum-chart-media__item'>
          <svg width={width} height={height}>
            <Group>
              <BarStackHorizontal
                data={data}
                keys={chartKeys}
                height={yMin}
                y={getYear}
                xScale={valueScale}
                yScale={yearScale}
                color={colorScale}
              >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => (
                    <rect
                      key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                      x={bar.x+xMin}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                      onClick={() => {
                        // pass
                      }}
                      onMouseLeave={() => {
                        this.setState({
                          popoverIsVisible: false,
                          keyIndicator: null
                        });
                      }}
                      onMouseMove={event => {
                        const { target } = event;
                        const { top, height, left } = target.getBoundingClientRect();
                        const yAxis = top + height / 2;
                        const padding = 5;
                        this.setState({
                          popoverIsVisible: true,
                          popoverPosition: {
                            yAxis,
                            right: window.innerWidth - (left - padding - bar.x)
                          },
                          popoverData: bar.bar.data,
                          keyIndicator
                        });
                      }}
                    />
                  ))
                )
              }
              </BarStackHorizontal>
              <AxisLeft
                left={xMin}
                scale={yearScale}
                tickStroke={labelAndTicksColor}
                stroke={labelAndTicksColor}
                tickLength={yTickLength}
                numTicks={years.length}
                tickComponent={({ formattedValue, ...tickProps }) => (
                  <text><tspan {...tickProps}>{formattedValue}</tspan></text>
                )}
                tickLabelProps={() => ({
                  fill: labelAndTicksColor,
                  textAnchor: "end",
                  fontSize: 8,
                  dy: '0.25em',
                  dx: '-0.25em'
                })}
              />
              <AxisBottom
                left={xMin}
                top={yMin}
                scale={valueScale}
                tickLabelProps={(value, index) => ({
                  fill: labelAndTicksColor,
                  fontSize: 8,
                  dx: '-3em'
                })}
                tickComponent={({ formattedValue, ...tickProps }) => (
                  <text><tspan {...tickProps}>{format(Math.max(...valueTotals))}</tspan></text>
                )}
                tickValues={[Math.max(...valueTotals)]}
                tickLength={xTickLength}
                numTicks={1}
                tickStroke={labelAndTicksColor}
                stroke={labelAndTicksColor}
              />
            </Group>
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
