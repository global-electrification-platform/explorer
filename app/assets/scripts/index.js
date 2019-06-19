import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Router, Route, Switch } from 'react-router-dom';

import config from './config';

// Views
import Home from './views/Home';
import Explore from './views/Explore';
import About from './views/About';
import SelectCountry from './views/SelectCountry';
import SelectModel from './views/SelectModel';
import UhOh from './views/UhOh';

// Store
import { store, history } from './store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path='/' component={Home} />
        <Redirect exact from='/explore' to='/countries' />
        <Route exact path='/countries' component={SelectCountry} />
        <Route exact path='/countries/:countryId/models' component={SelectModel} />
        <Route exact path='/explore/:modelId' component={Explore} />
        <Route exact path='/about' component={About} />
        <Route path='*' component={UhOh} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

/* eslint-disable no-console */
console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);
/* eslint-enable no-console */
