import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

// Reducers and Actions
import rootReducer from './reducers';

import createHistory from 'history/createBrowserHistory';
export const history = createHistory();

export default function configureStore () {
  const initialState = {};
  const enhancers = [];
  const middleware = [thunk, routerMiddleware(history)];

  // Dev Tools
  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  );

  const store = createStore(rootReducer, initialState, composedEnhancers);

  return { store };
}
