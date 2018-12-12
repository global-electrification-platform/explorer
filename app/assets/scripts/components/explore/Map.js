import React from 'react';
import mapboxgl from 'mapbox-gl';
import { PropTypes as T } from 'prop-types';

import { mapboxAccessToken, environment } from '../../config';
mapboxgl.accessToken = mapboxAccessToken;

const mapLayers = [
  {
    id: '1',
    paint: {
      'fill-color': '#fe5931'
    }
  },
  {
    id: '2',
    paint: {
      'fill-color': '#ffC700'
    }
  },
  {
    id: '3',
    paint: {
      'fill-color': '#1ea896'
    }
  },
  {
    id: '4',
    paint: {
      'fill-color': '#19647e'
    }
  },
  {
    id: '5',
    paint: {
      'fill-color': 'pink'
    }
  },
  {
    id: '6',
    paint: {
      'fill-color': 'red'
    }
  },
  {
    id: '7',
    paint: {
      'fill-color': 'purple'
    }
  },
  {
    id: '8',
    paint: {
      'fill-color': 'cyan'
    }
  }
];

class Map extends React.Component {
  constructor (props) {
    super(props);

    this.updateScenario = this.updateScenario.bind(this);
    this.clearMap = this.clearMap.bind(this);
    this.state = {
      mapLoaded: false
    };
  }

  componentDidMount () {
    this.initMap();
  }

  componentDidUpdate (prevProps) {
    const { scenario } = this.props;
    if (
      this.state.mapLoaded &&
      scenario.fetched &&
      !prevProps.scenario.fetched
    ) {
      this.updateScenario();
    }
  }

  componentWillUnmount () {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap () {
    if (!mapboxgl.supported()) {
      return;
    }

    this.map = new mapboxgl.Map({
      container: this.refs.mapEl,
      style: 'mapbox://styles/mapbox/light-v9',
      bounds: [[32.34375, -9.145486056167277], [36.2109375, -17.35063837604883]]
    });

    this.map.on('load', () => {
      this.setState({ mapLoaded: true });

      this.map.addSource('gep-vt', {
        type: 'vector',
        url: 'mapbox://devseed.2a5bvzlz'
      });

      // Setup layers
      for (const layer of mapLayers) {
        this.map.addLayer(
          Object.assign(
            {
              type: 'fill',
              source: 'gep-vt',
              'source-layer': 'mw',
              filter: ['==', 'id_int', 'nothing']
            },
            layer
          )
        );
      }

      this.updateScenario();
    });
  }

  clearMap () {
    for (const layer of mapLayers) {
      this.map.setFilter(layer.id, ['==', 'id_int', 'nothing']);
    }
  }

  updateScenario () {
    const { fetched, getData } = this.props.scenario;

    this.clearMap();

    if (fetched) {
      const data = getData();
      const { layers } = data;
      const layerIds = Object.keys(layers);

      for (const layerId of layerIds) {
        this.map.setFilter(layerId, ['in', 'id_int'].concat(layers[layerId]));
      }
    }
  }

  render () {
    return (
      <section className='exp-map'>
        <h1 className='exp-map__title'>Map</h1>
        {mapboxgl.supported() ? (
          <div ref='mapEl' style={{ width: '100%', height: '100%' }} />
        ) : (
          <div className='mapbox-no-webgl'>
            <p>WebGL is not supported or disabled.</p>
          </div>
        )}
      </section>
    );
  }
}

if (environment !== 'production') {
  Map.propTypes = {
    scenario: T.object
  };
}

export default Map;
