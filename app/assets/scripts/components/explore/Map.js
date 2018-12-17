import React from 'react';
import { render } from 'react-dom';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import { PropTypes as T } from 'prop-types';

import MapPopover from './connected/MapPopover';
import { mapboxAccessToken, environment, techLayers } from '../../config';

mapboxgl.accessToken = mapboxAccessToken;

const sourceId = 'gep-vt';
const sourceLayer = 'mw';

class Map extends React.Component {
  constructor (props) {
    super(props);

    this.updateScenario = this.updateScenario.bind(this);
    this.clearMap = this.clearMap.bind(this);
    this.zoomToFeatures = this.zoomToFeatures.bind(this);
    this.state = {
      mapLoaded: false
    };
  }

  componentDidMount () {
    this.initMap();
  }

  componentDidUpdate (prevProps) {
    const { scenario } = this.props;
    if (this.state.mapLoaded) {
      if (scenario.fetching && !prevProps.scenario.fetching) {
        this.clearMap();
      }
      if (scenario.fetched && !prevProps.scenario.fetched) {
        this.updateScenario();
      }
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
      style: 'mapbox://styles/devseed/cjpbi9n1811yd2snwl9ezys5p',
      bounds: [[32.34375, -9.145486056167277], [36.2109375, -17.35063837604883]]
    });

    // Disable map rotation using right click + drag.
    this.map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture.
    this.map.touchZoomRotate.disableRotation();

    // Add zoom controls.
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    // Remove compass.
    document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();

    this.map.on('load', () => {
      this.setState({ mapLoaded: true });

      this.map.addSource(sourceId, {
        type: 'vector',
        url: 'mapbox://devseed.2a5bvzlz'
      });

      // Setup layers
      for (const layer of techLayers) {
        this.map.addLayer({
          id: layer.id,
          type: 'fill',
          source: sourceId,
          'source-layer': sourceLayer,
          filter: ['==', 'id_int', 'nothing'],
          paint: {
            'fill-color': layer.color
          }
        });
      }

      const mapLayersIds = techLayers.map(l => l.id);

      this.map.on('mousemove', e => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: mapLayersIds
        });
        this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      });

      this.map.on('click', e => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: mapLayersIds
        });
        if (features.length) {
          console.log('features[0]', features[0]);
          this.showPopover(features[0], e.lngLat);
        }
      });

      this.updateScenario();
    });
  }

  zoomToFeatures (featuresIds) {
    const features = this.map.querySourceFeatures(sourceId, {
      sourceLayer,
      filter: ['in', 'id_int'].concat(featuresIds)
    });

    if (features.length > 0) {
      const mapBbox = bbox({
        type: 'FeatureCollection',
        features
      });
      this.map.fitBounds(mapBbox, { padding: 20 });
    }
  }

  clearMap () {
    for (const layer of techLayers) {
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

      let featuresIds = [];
      for (const layerId of layerIds) {
        // Accumulate feature ids to perform map zoom
        featuresIds = featuresIds.concat(layers[layerId]);

        // Apply style to features on this layer
        this.map.setFilter(layerId, ['in', 'id_int'].concat(layers[layerId]));
      }
      this.zoomToFeatures(featuresIds);
    }
  }

  showPopover (feature, lngLat) {
    let popoverContent = document.createElement('div');

    const fid = feature.properties.id_int;
    const sid = this.props.scenario.getData().id;
    // The road score has to be scaled to accurately compare roads
    // within provinces.
    render(
      <MapPopover
        featureId={fid}
        scenarioId={sid}
        onCloseClick={e => {
          e.preventDefault();
          this.popover.remove();
        }}
      />,
      popoverContent
    );

    // Populate the popup and set its coordinates
    // based on the feature found.
    if (this.popover != null) {
      this.popover.remove();
    }

    this.popover = new mapboxgl.Popup({ closeButton: false })
      .setLngLat(lngLat)
      .setDOMContent(popoverContent)
      .addTo(this.map);
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
