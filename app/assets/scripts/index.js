import config from './config';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';

// Views
import App from './App';
import Home from './views/Home';

// Store
import configureStore from './store';
const { store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App>
        <Switch>
          <Route from="/" component={Home} />
        </Switch>
      </App>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);
