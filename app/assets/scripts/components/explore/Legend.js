import React, { Component, Fragment } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment, techLayers } from '../../config';

class Legend extends Component {
  renderColor (layerId) {
    const { title, label, color } = techLayers[layerId];
    return (
      <Fragment key={layerId}>
        <dt>
          <span className={`lgfx`} style={{ backgroundColor: color }}>
            {title}
          </span>
        </dt>
        <dd>{label}</dd>
      </Fragment>
    );
  }

  render () {
    const { scenario } = this.props;

    const layersIds = scenario.layers ? Object.keys(scenario.layers) : [];

    return (
      <div className='sum-block'>
        <h2 className='sum-block__title'>Legend</h2>
        <dl className='legend-list'>
          {layersIds.map(layersId => this.renderColor(layersId))}
        </dl>
      </div>
    );
  }
}

if (environment !== 'production') {
  Legend.propTypes = {
    scenario: T.object
  };
}

export default Legend;
