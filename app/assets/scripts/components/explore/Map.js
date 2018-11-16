import React from 'react';
import mapboxgl from 'mapbox-gl';

import { mapboxAccessToken } from '../../config';
mapboxgl.accessToken = mapboxAccessToken;

class Explore extends React.Component {
  componentDidMount () {
    this.initMap();
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
        id: 'mw-data',
        type: 'fill',
        source: 'mw',
        'source-layer': 'mw',
        paint: {
          'fill-color': 'red'
        }
      });
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

export default Explore;
