import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import map from 'lodash.map';

import { environment, techLayers } from '../../config';

import { Group } from '@vx/group';
import { Pie } from '@vx/shape';

const formatter = n => {
  let unit;
  let divider;
  let digits = 1;

  if (n > 1000000) {
    unit = 'M';
    divider = 1000000;
  } else if (n > 1000) {
    unit = 'k';
    divider = 1000;
    digits = 0;
  } else {
    unit = '';
    divider = 1;
    digits = 0;
  }
  return `${Math.round(n / divider).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })} ${unit}`;
};

const indicatorsLabels = {
  electrifiedPopulation: {
    label: 'People Affected',
    format: formatter
  },
  investmentCost: {
    label: 'Investment Required',
    format: n => {
      return `$${formatter(n)}`;
    }
  },
  newCapacity: {
    label: 'Added Capactiy',
    format: n => {
      return `${formatter(n)} kW`;
    }
  }
};

class Charts extends Component {
  constructor (props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);
  }

  renderChart (keyIndicator) {
    const { summary, summaryByType } = this.props.scenario;
    const { label, format } = indicatorsLabels[keyIndicator];

    const height = 144;
    const padding = 8;
    const radius = (height - 2 * padding) / 2;
    const thickness = 20;

    const data = map(summaryByType[keyIndicator], (value, type) => {
      // Get layer configuration for type
      const layer = techLayers.filter(l => l.id === type)[0];
      return { value, type, layer };
    });

    return (
      <figure className='sum-chart-media'>
        <div className='sum-chart-media__item'>
          <svg width={height} height={height} key={keyIndicator}>
            <Group top={height / 2} left={height / 2}>
              <text textAnchor='middle' dy='0.5em'>
                {format(summary[keyIndicator])}
              </text>
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
                        <path className='slice' d={pie.path(arc)} fill={arc.data.layer.color} />
                      </g>
                    );
                  });
                }}
              </Pie>
            </Group>
          </svg>
        </div>
        <figcaption className='sum-chart-media__caption'>{label}</figcaption>
      </figure>
    );
  }
  render () {
    return ['electrifiedPopulation', 'investmentCost', 'newCapacity'].map(
      indicator => {
        return this.renderChart(indicator);
      }
    );
  }
}

if (environment !== 'production') {
  Charts.propTypes = {
    scenario: T.object
  };
}

export default Charts;
