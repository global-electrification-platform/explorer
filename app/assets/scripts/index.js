import config from './config';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';

// Views
import App from './App';
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
    <HashRouter>
      <App>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/select-country" component={SelectCountry}/>
          <Route path="/select-model" component={SelectModel} />
          <Route path="/explore" component={Explore} />
          <Route path="/docs" component={Docs} />
          <Route path="/about" component={About} />
        </Switch>
      </App>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);
