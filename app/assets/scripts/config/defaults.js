'use strict';

export default {
  appTitle: 'Global Electrification Platform Explorer',
  appShortTitle: 'GEP Exp',
  appDescription:
    'A tool to explore least cost electrification strategies around the world.',
  baseUrl: 'http://localhost:9000',
  dataServiceUrl: 'http://localhost:3000',
  techLayers: [
    {
      id: '1',
      label: 'Grid extension',
      color: '#893831'
    },
    {
      id: '2',
      label: 'Stand-alone - Diesel',
      color: '#fe5931'
    },
    {
      id: '3',
      label: 'Stand-alone - Photovoltaic',
      color: '#ffc700'
    },
    {
      id: '4',
      label: 'Mini-grid - Diesel',
      color: '#8fb722'
    },
    {
      id: '5',
      label: 'Mini-grid - Photovoltaic',
      color: '#1ea896'
    },
    {
      id: '6',
      label: 'Mini-grid - Wind',
      color: '#00a2ce'
    },
    {
      id: '7',
      label: 'Mini-grid - Hydro',
      color: '#19647e'
    }
  ]
};
