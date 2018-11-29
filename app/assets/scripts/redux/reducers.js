import { combineReducers } from 'redux';
import { baseAPIReducer } from './utils';

//
// MODEL
//
const modelReducerInitialState = {};
function modelReducer (state = modelReducerInitialState, action) {
  return baseAPIReducer(state, action, 'MODEL');
}

//
// SCENARIO Reducer
//
const scenarioReducerInitialState = {
  fetched: false,
  fetching: false,
  data: {},
  error: null
};
function scenarioReducer (state = scenarioReducerInitialState, action) {
  return baseAPIReducer(state, action, 'SCENARIO');
}

//
//  STATS Reducer
//
const statsReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {}
};
function statsReducer (state = statsReducerInitialState, action) {
  return baseAPIReducer(state, action, 'STATS');
}

export default combineReducers({
  scenario: scenarioReducer,
  individualModels: modelReducer,
  stats: statsReducer
});
