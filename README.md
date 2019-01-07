# GEP Explorer

Web application to explore least electrification scenarios on Global Electrificaion Platform.


## Installation and Usage

The steps below will walk you through setting up a development environment for the frontend.

### Prerequisites

To set up the development environment for this website, you'll need to install the following on your system:

- [Git](https://git-scm.com)
- [Node.js](http://nodejs.org), version 8 or later
- [Yarn](https://yarnpkg.com)

### Install dependencies

Clone this repository locally and run:

    yarn

#### Config files
The config files can be found in `app/assets/scripts/config`. After installing the project, there will be an empty `local.js` that you can use to set the config. This file should not be committed.

The configuration is overridable by environment variables, expressed between []:

- `appTitle` - Meta information. The app title.
- `appShortTitle` - Meta information. The short app title.
- `appDescription` - Meta information. The app description.
- `dataServiceUrl` - The address for the API. [API]
- `mapboxAccessToken` - The Mapbox Token to load map tiles from. [MB_TOKEN]

Example:
```
module.exports = {
  api: 'http://localhost:3000',
  mbtoken: 'asfd23rlmksjdf023rnnsafd'
};
```

### Development

Start server with live code reload at [http://localhost:9000](http://localhost:9000):

    yarn serve

### Build to production

Generate a minified build to `dist` folder:

    yarn build


## Links & References

- [First Issue](https://github.com/developmentseed/gep-coordination/issues/4)
- [Coordination](https://github.com/developmentseed/gep-coordination)
- [Explorer](https://github.com/developmentseed/gep-explorer)
- [Data Service](https://github.com/developmentseed/gep-data-service)
- [Prototype](https://github.com/developmentseed/gep-prototype)

## License

[MIT](LICENSE)
