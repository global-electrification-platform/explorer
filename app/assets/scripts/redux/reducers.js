import { combineReducers } from 'redux';
import { baseAPIReducer } from './utils';

//
//  MODEL Reducer
//
const modelReducerInitialState = {};
function modelReducer (state = modelReducerInitialState, action) {
  return baseAPIReducer(state, action, 'MODEL');
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
  individualModels: modelReducer,
  stats: statsReducer
});
