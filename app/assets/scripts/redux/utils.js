import get from 'lodash.get';

/**
 * Delays the execution in x milliseconds.
 *
 * @param {int} millis Milliseconds
 */
function delay (millis) {
  return new Promise(resolve => {
    setTimeout(resolve, millis);
  });
}

/**
 * Performs a request to the given url returning the response in json format
 * or throwing an error.
 *
 * @param {string} url Url to query
 * @param {object} options Options for fecth
 */
export async function fetchJSON (url, options) {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log('fetchJSON error', error); // eslint-disable-line
    throw error;
  }
}

/**
 * Performs a query to the given url dispatching the appropriate actions.
 * If there's data in the state, that is used instead.
 *
 * @param {object} options Options.
 * @param {string} options.statePath Path to where data is on the state.
 * @param {string} options.url Url to query.
 * @param {func} options.requestFn Request action to dispatch.
 * @param {func} options.receiveFn Receive action to dispatch.
 * @param {func} options.mutator Function to change the response before sending
 *                               it to the receive function.
 */
export function fetchDispatchCacheFactory ({
  statePath,
  url,
  requestFn,
  receiveFn,
  mutator,
  __devDelay
}) {
  mutator = mutator || (v => v);
  return async function (dispatch, getState) {
    const pageState = get(getState(), statePath);
    if (pageState && pageState.fetched && !pageState.error) {
      if (__devDelay) await delay(__devDelay);
      return dispatch(receiveFn(pageState.data));
    }
    dispatch(requestFn());

    try {
      const response = await fetchJSON(url);
      const content = mutator(response);
      if (__devDelay) await delay(__devDelay);
      return dispatch(receiveFn(content));
    } catch (error) {
      if (__devDelay) await delay(__devDelay);
      console.log('error', error); // eslint-disable-line
      return dispatch(receiveFn(null, error));
    }
  };
}

/**
 * Base reducer for an api request.
 *
 * Uses the following actions:
 * - INVALIDATE_<actionName>
 * - REQUEST_<actionName>
 * - RECEIVE_<actionName>
 *
 * @param {object} state The state.
 * @param {object} action The action.
 * @param {string} actionName The action name to use as suffix
 */
function APIReducer (state, action, actionName) {
  switch (action.type) {
    case `INVALIDATE_${actionName}`:
      return state;
    case `REQUEST_${actionName}`:
      return {
        fetching: true,
        fetched: false,
        data: {}
      };
    case `RECEIVE_${actionName}`:
      let st = {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: {},
        error: null
      };

      if (action.error) {
        st.error = action.error;
      } else {
        st.data = action.data;
      }

      return st;
  }
  return state;
}

/**
 * Base reducer for an api request, taking into account the action.id
 * If it exists it will store in the state under that path. Allows for
 * page caching.
 *
 * @see APIReducer()
 *
 * @param {object} state The state.
 * @param {object} action The action.
 * @param {string} actionName The action name to use as suffix
 */
export function baseAPIReducer (state, action, actionName) {
  return typeof action.id === 'undefined'
    ? APIReducer(state, action, actionName)
    : Object.assign({}, state, {
      [action.id]: APIReducer(state, action, actionName)
    });
}

/**
 * Gets the given path from the state or return the default:
 * {
 *   fetched: false,
 *   fetching: false,
 *   data: {},
 *   error: null
 * }
 *
 * @see lodash.get
 *
 * @param {object} state The redux state
 * @param {array | string} path The path to get. Passed to lodash.get
 *
 * @returns {object} State or default
 */
export function getFromState (state, path) {
  return get(state, path, {
    fetched: false,
    fetching: false,
    data: {},
    error: null
  });
}

/**
 * Wraps the api result with helpful functions.
 * To be used in the state selector.
 *
 * @param {object} stateData Object as returned from an api request. Expected to
 *                           be in the following format:
 *                           {
 *                             fetched: bool,
 *                             fetching: bool,
 *                             data: object,
 *                             error: null | error
 *                           }
 *
 * @returns {object}
 * {
 *   raw(): retuns the data as is.
 *   isReady(): Whether or not the fetching finished and was fetched.
 *   hasError(): Whether the resquest finished with an error.
 *   getData(): Returs the data. If the data has a results list will return that
 *   getMeta(): If there's a meta object it will be returned
 *
 * As backward compatibility all data properties are accessible directly.
 * }
 */
export function wrapApiResult (stateData) {
  const { fetched, fetching, data, error } = stateData;
  const ready = fetched && !fetching;
  return Object.assign({},
    {
      raw: () => stateData,
      isReady: () => ready,
      hasError: () => ready && !!error,
      getData: (def = {}) => (ready ? data.results || data : def),
      getMeta: (def = {}) => (ready ? data.meta : def)
    },
    stateData
  );
}
