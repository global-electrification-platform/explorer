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

// Store
import configureStore from './store';
const { store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={createHistory()}>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/select-country' component={SelectCountry} />
        <Route path='/select-model' component={SelectModel} />
        <Route
          exact
          path='/explore'
          render={() => {
            return <Redirect to='/explore/mw-1' />;
          }}
        />
        <Route path='/explore/:modelId' component={Explore} />
        <Route path='/docs' component={Docs} />
        <Route path='/about' component={About} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

/* eslint-disable no-console */
console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);
/* eslint-enable no-console */
