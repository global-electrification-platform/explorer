import 'babel-polyfill';
import config from './config';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

// Views
import Home from './views/Home';
import Explore from './views/Explore';
import Docs from './views/Docs';
import About from './views/About';
import SelectCountry from './views/SelectCountry';
import SelectModel from './views/SelectModel';
import UhOh from './views/UhOh';

// Store
import configureStore from './store';
const { store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={createHistory()}>
      <Switch>
        <Route exact path='/' component={Home} />
        <Redirect exact from='/explore' to='/countries' />
        <Route exact path='/countries' component={SelectCountry} />
        <Route exact path='/countries/:countryId/models' component={SelectModel} />
        <Route exact path='/explore/:modelId' component={Explore} />
        <Route exact path='/docs' component={Docs} />
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
