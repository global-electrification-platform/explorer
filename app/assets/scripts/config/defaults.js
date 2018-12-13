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
      color: '#fe5931'
    },
    {
      id: '2',
      label: 'Stand-alone - Diesel',
      color: '#ffC700'
    },
    {
      id: '3',
      label: 'Stand-alone - PV',
      color: '#1ea896'
    },
    {
      id: '4',
      label: 'Mini-grid - Diesel',
      color: '#19647e'
    },
    {
      id: '5',
      label: 'Mini-grid - PV',
      color: 'red'
    },
    {
      id: '6',
      label: 'Mini-grid - Wind',
      color: 'blue'
    },
    {
      id: '7',
      label: 'Mini-grid - Hydro',
      color: 'green'
    }
  ]
};
