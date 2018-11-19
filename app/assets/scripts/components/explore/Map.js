import React from 'react';
import mapboxgl from 'mapbox-gl';
import { PropTypes as T } from 'prop-types';

import { mapboxAccessToken, environment } from '../../config';
mapboxgl.accessToken = mapboxAccessToken;

class Map extends React.Component {
  constructor (props) {
    super(props);

    this.updateMap = this.updateMap.bind(this);
  }

  componentDidMount () {
    this.initMap();
  }

  componentDidUpdate (prevProps) {
    if (this.props.dashboardChangedAt > prevProps.dashboardChangedAt) {
      this.updateMap();
    }
  }

  componentWillUnmount () {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap () {
    this.map = new mapboxgl.Map({
      container: this.refs.mapEl,
      style: 'mapbox://styles/mapbox/light-v9',
      bounds: [[32.34375, -9.145486056167277], [36.2109375, -17.35063837604883]]
    });

    this.map.on('load', () => {
      this.mapLoaded = true;

      this.map.addSource('mw', {
        type: 'vector',
        tiles: ['http://localhost:8888/mw/{z}/{x}/{y}.pbf']
      });

      this.map.addLayer({
        id: 'grid',
        type: 'fill',
        source: 'mw',
        'source-layer': 'mw',
        paint: {
          'fill-color': 'red'
        },
        filter: ['==', 'id', 'nothing']
      });
      this.map.addLayer({
        id: 'diesel',
        type: 'fill',
        source: 'mw',
        'source-layer': 'mw',
        paint: {
          'fill-color': 'blue'
        },
        filter: ['==', 'id', 'nothing']
      });
      this.map.addLayer({
        id: 'pv',
        type: 'fill',
        source: 'mw',
        'source-layer': 'mw',
        paint: {
          'fill-color': 'green'
        },
        filter: ['==', 'id', 'nothing']
      });
      this.map.addLayer({
        id: 'mini-grid',
        type: 'fill',
        source: 'mw',
        'source-layer': 'mw',
        paint: {
          'fill-color': 'yellow'
        },
        filter: ['==', 'id', 'nothing']
      });

      this.updateMap();
    });
  }

  updateMap () {
    const eTypes = ['grid', 'diesel', 'pv', 'mini-grid'];
    let features = {};

    for (let index = 0; index < 216906; index++) {
      const randomIndex = Math.floor(Math.random() * 4);
      const eType = eTypes[randomIndex];
      if (!features[eType]) features[eType] = [];
      features[eType].push(`mw-${index}`);
    }

    eTypes.forEach(eType => {
      this.map.setFilter(eType, ['in', 'id'].concat(features[eType]));
    });
  }

  render () {
    return (
      <section className='exp-map'>
        <h1 className='exp-map__title'>Map</h1>
        <div ref='mapEl' style={{ width: '100%', height: '100%' }} />
      </section>
    );
  }
}

if (environment !== 'production') {
  Map.propTypes = {
    dashboardChangedAt: T.date
  };
}

export default Map;
