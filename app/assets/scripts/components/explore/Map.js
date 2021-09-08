import React from 'react';
import { render } from 'react-dom';
import throttle from 'lodash.throttle';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import { PropTypes as T } from 'prop-types';

import MapPopover from './connected/MapPopover';
import { mapboxAccessToken, environment, basemapStyleLink } from '../../config';
import MapboxControl from '../MapboxReactControl';
import LayerControlDropdown from './MapLayerControl';

mapboxgl.accessToken = mapboxAccessToken;

/**
 * Id of the last "topmost" layer, before which all GEP layers
 * should be added. This is needed to show place names and borders above
 * all other layers.
 **/
const labelsAndBordersLayer = 'admin-2-boundaries-bg';

/**
 * Identifier for vector tiles source, can be any string.
 **/
const gepFeaturesSourceId = 'gep-vt';

// Adds layers for points
const _customLayerForSource = (sourceId, sourceLayer) => [
  { id: `${sourceId}-custom`,
    source: sourceId,
    'source-layer': sourceLayer.name,
    ...sourceLayer.style
  }
];

const _buildLayersForSource = (sourceId, sourceLayer) => [
  {
    id: `${sourceId}-line`,
    type: 'line',
    source: sourceId,
    'source-layer': sourceLayer,
    filter: ['==', '$type', 'LineString'],
    layout: {
      visibility: 'none'
    },
    paint: {
      'line-color': 'red'
    }
  },
  {
    id: `${sourceId}-polygon`,
    type: 'fill',
    source: sourceId,
    'source-layer': sourceLayer,
    filter: ['==', '$type', 'Polygon'],
    layout: {
      visibility: 'none'
    },
    paint: {
      'fill-color': 'blue'
    }
  },
  {
    id: `${sourceId}-point`,
    type: 'circle',
    source: sourceId,
    'source-layer': sourceLayer,
    filter: ['==', '$type', 'Point'],
    paint: {
      'circle-color': 'purple'
    }
  }
];

const buildLayersForSource = (sourceId, sourceLayer) => {
  if (typeof (sourceLayer) === typeof ('a')) {
    return _buildLayersForSource(sourceId, sourceLayer);
  } else {
    return _customLayerForSource(sourceId, sourceLayer);
  }
};

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

    // Quick and dirty diffing.
    const prevLState = prevProps.layersState.join('');
    const lState = this.props.layersState.join('');
    if (prevLState !== lState) {
      this.toggleExternalLayers();
    }

    // Manually render detached component.
    this.layerDropdownControl &&
      this.layerDropdownControl.render(this.props, this.state);
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

    const { bounds, externalLayers, modelVT, techLayers } = this.props;

    this.map = new mapboxgl.Map({
      container: this.refs.mapEl,
      style: basemapStyleLink,
      bounds: bounds,
      preserveDrawingBuffer: true
    });

    // Disable map rotation using right click + drag.
    this.map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture.
    this.map.touchZoomRotate.disableRotation();

    // Add zoom controls.
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    this.layerDropdownControl = new MapboxControl(props => (
      <LayerControlDropdown
        layersConfig={props.externalLayers}
        layersState={props.layersState}
        handleLayerChange={props.handleLayerChange}
      />
    ));

    this.map.addControl(this.layerDropdownControl, 'bottom-left');

    // Remove compass.
    document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();

    this.map.on('load', () => {
      this.setState({ mapLoaded: true });

      const mapLayersIds = techLayers.map(l => l.id);

      // Add external layers.
      // Layers come from the model. Each layer object must have:
      // id:            Id of the layer
      // label:         Label for display
      // type:          (vector|raster)
      // url:           Url to a tilejson or mapbox://. Use interchangeably with tiles
      // tiles:         Array of tile url. Use interchangeably with url
      // vectorLayers:  Array of source layers to show. Only in case of type vector
      //   - VectorLayers may be a string of the layer name, or
      //       - name: string, style: json style object
      // position: top|bottom|undefined: optional, relative to the cluster layer
      const addExternalLayers = (position) => {
        externalLayers.forEach(layer => {
          const layerPosition = layer.position || 'bottom';
          if (layerPosition !== position) {
            return;
          }
          if (layer.type === 'vector') {
            if (!layer.vectorLayers || !layer.vectorLayers.length) {
              // eslint-disable-next-line no-console
              return console.warn(
                `Layer [${layer.label}] has missing (vectorLayers) property.`
              );
            }
            if ((!layer.tiles || !layer.tiles.length) && !layer.url) {
              // eslint-disable-next-line no-console
              return console.warn(
                `Layer [${layer.label}] must have (url) or (tiles) property.`
              );
            }

            const sourceId = `ext-${layer.id}`;
            let options = { type: 'vector' };

            if (layer.tiles) {
              options.tiles = layer.tiles;
            } else if (layer.url) {
              options.url = layer.url;
            }

            this.map.addSource(sourceId, options);
            layer.vectorLayers.forEach(vt => {
              buildLayersForSource(sourceId, vt).forEach(l => {
                this.map.addLayer(l, labelsAndBordersLayer);
              });
            });

            // Raster layer type.
          } else if (layer.type === 'raster') {
            if (!layer.tiles || !layer.tiles.length) {
              // eslint-disable-next-line no-console
              return console.warn(
                `Layer [${layer.label}] must have (tiles) property.`
              );
            }
            const sourceId = `ext-${layer.id}`;
            this.map.addSource(sourceId, {
              type: 'raster',
              tiles: layer.tiles
            });
            this.map.addLayer(
              {
                id: `${sourceId}-tiles`,
                type: 'raster',
                source: sourceId
              },
              labelsAndBordersLayer
            );
          } else {
            // eslint-disable-next-line no-console
            console.warn(
              `Layer [${
                layer.label
              }] has unsupported type [layer.type] and won't be added.`
            );
          }
        });
      };

      addExternalLayers('bottom');

      const sourceLayer = modelVT.id;

      this.map.addSource(gepFeaturesSourceId, {
        type: 'vector',
        url: modelVT.url
      });

      // Init cluster polygon layers
      for (const layer of techLayers) {
        this.map.addLayer(
          {
            id: layer.id,
            type: 'fill',
            source: gepFeaturesSourceId,
            'source-layer': sourceLayer,
            filter: ['==', 'id', 'nothing'],
            paint: {
              'fill-color': layer.color
            }
          },
          labelsAndBordersLayer
        );
      }

      addExternalLayers('top');
      this.toggleExternalLayers();

      /**
       * Hover outline layer
       */
      this.map.addLayer(
        {
          id: 'hovered-outline',
          type: 'line',
          source: gepFeaturesSourceId,
          'source-layer': sourceLayer,
          filter: ['==', 'id', 'nothing'],
          paint: {
            'line-color': '#14213d',
            'line-opacity': 0.64,
            'line-width': 2
          }
        },
        labelsAndBordersLayer
      );

      /**
       * Hover fill layer
       */
      this.map.addLayer(
        {
          id: 'hovered-fill',
          type: 'fill',
          source: gepFeaturesSourceId,
          'source-layer': sourceLayer,
          filter: ['==', 'id', 'nothing'],
          paint: {
            'fill-color': 'transparent'
          }
        },
        labelsAndBordersLayer
      );

      /**
       * Selected feature layer
       */
      this.map.addLayer(
        {
          id: 'selected',
          type: 'line',
          source: gepFeaturesSourceId,
          'source-layer': sourceLayer,
          filter: ['==', 'id', 'nothing'],
          paint: {
            'line-color': '#14213d',
            'line-opacity': 0.64,
            'line-width': 2
          }
        },
        labelsAndBordersLayer
      );

      const self = this;
      const highlighFeature = throttle(
        function (e) {
          const features = self.map.queryRenderedFeatures(e.point, {
            layers: mapLayersIds
          });

          if (features.length > 0) {
            self.map.getCanvas().style.cursor = 'pointer';

            const featureId = features[0].properties.id;
            self.map.setFilter(
              'hovered-fill',
              ['==', 'id'].concat(featureId)
            );
            self.map.setFilter(
              'hovered-outline',
              ['==', 'id'].concat(featureId)
            );
          } else {
            self.map.getCanvas().style.cursor = '';
            self.map.setFilter('hovered-fill', ['==', 'id', 'nothing']);
            self.map.setFilter('hovered-outline', ['==', 'id', 'nothing']);
          }
        },
        100,
        {
          leading: true
        }
      );
      this.map.on('mousemove', highlighFeature);

      this.map.on('click', e => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: mapLayersIds
        });
        if (features.length) {
          this.showPopover(features[0], e.lngLat);
        }
      });

      const onSourceData = e => {
        if (e.sourceId === 'gep-vt' && e.isSourceLoaded && e.tile) {
          this.map.off('sourcedata', onSourceData);
          this.updateScenario();
        }
      };

      this.map.on('sourcedata', onSourceData);
    });
  }

  toggleExternalLayers () {
    if (!this.state.mapLoaded) return;

    const { externalLayers, layersState } = this.props;

    externalLayers.forEach((layer, lIdx) => {
      if (layer.type === 'vector') {
        const layers = [
          `ext-${layer.id}-line`,
          `ext-${layer.id}-polygon`,
          `ext-${layer.id}-point`,
          `ext-${layer.id}-custom`
        ];
        const visibility = layersState[lIdx] ? 'visible' : 'none';
        layers.forEach(l =>
          this.map.getLayer(l) && this.map.setLayoutProperty(l, 'visibility', visibility)
        );
      } else if (layer.type === 'raster') {
        const visibility = layersState[lIdx] ? 'visible' : 'none';
        this.map.setLayoutProperty(
          `ext-${layer.id}-tiles`,
          'visibility',
          visibility
        );
      }
    });
  }

  zoomToFeatures (featuresIds) {
    const { modelVT } = this.props;
    const features = this.map.querySourceFeatures(gepFeaturesSourceId, {
      sourceLayer: modelVT.id,
      filter: ['in', 'id'].concat(featuresIds)
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
    for (const layer of this.props.techLayers) {
      this.map.setFilter(layer.id, ['==', 'id', 'nothing']);
    }
  }

  updateScenario () {
    const { isReady, hasError, getData } = this.props.scenario;

    this.clearMap();

    if (isReady() && !hasError()) {
      const data = getData();
      const { layers } = data;
      const layerIds = Object.keys(layers);

      let featuresIds = [];
      for (const layerId of layerIds) {
        // Accumulate feature ids to perform map zoom
        featuresIds = featuresIds.concat(layers[layerId]);

        // Apply style to features on this layer
        this.map.setFilter(layerId, ['in', 'id'].concat(layers[layerId]));
      }
      this.zoomToFeatures(featuresIds);
    }
  }

  showPopover (feature, lngLat) {
    let popoverContent = document.createElement('div');

    const fid = feature.properties.id;
    const sid = this.props.scenario.getData().id;

    render(
      <MapPopover
        featureId={fid}
        scenarioId={sid}
        year={this.props.year}
        onCloseClick={e => {
          e.preventDefault();
          this.popover.remove();
        }}
      />,
      popoverContent
    );

    if (this.popover != null) {
      this.popover.remove();
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    this.popover = new mapboxgl.Popup({ closeButton: false, offset: 10 })
      .setLngLat(lngLat)
      .setDOMContent(popoverContent)
      .once('open', e => {
        this.map.setFilter('selected', ['in', 'id'].concat(fid));
      })
      .once('close', e => {
        this.map.setFilter('selected', ['in', 'id', 'nothing']);
      })
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
    bounds: T.array,
    scenario: T.object,
    year: T.number,
    handleLayerChange: T.func,
    modelVT: T.object,
    externalLayers: T.array,
    techLayers: T.array,
    layersState: T.array
  };
}

export default Map;
