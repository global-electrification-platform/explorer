import React, { Component, Fragment } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';

class Legend extends Component {
  renderColor (layerId) {
    const layer = this.props.techLayers.filter(l => l.id === layerId)[0];

    const { title, label, color } = layer || {
      color: 'white',
      title: 'white',
      label: 'Unidentified tech'
    };

    return (
      <Fragment key={layerId}>
        <dt>
          <span className={`lgfx`} style={{ backgroundColor: color }}>
            {title || label}
          </span>
        </dt>
        <dd>{label}</dd>
      </Fragment>
    );
  }

  render () {
    const { scenario } = this.props;

    // Get layer ids from the pop properties.
    const layersIdsSet = new Set();
    Object.keys(scenario.summaryByType.popConnectedBaseYear)
      .forEach(k => layersIdsSet.add(k));
    Object.keys(scenario.summaryByType.popConnectedIntermediateYear)
      .forEach(k => layersIdsSet.add(k));
    Object.keys(scenario.summaryByType.popConnectedFinalYear)
      .forEach(k => layersIdsSet.add(k));

    const layersIds = Array.from(layersIdsSet);

    return (
      layersIds.length > 0 && (
        <div className='sum-block'>
          <h2 className='sum-block__title'>Legend</h2>
          <dl className='legend-list'>
            {layersIds.map(layersId => this.renderColor(layersId))}
          </dl>
        </div>
      )
    );
  }
}

if (environment !== 'production') {
  Legend.propTypes = {
    scenario: T.object,
    techLayers: T.array
  };
}

export default Legend;
