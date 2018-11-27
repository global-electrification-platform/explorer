import { combineReducers } from 'redux';
import { baseAPIReducer } from './utils';

//
//  MODEL Reducer
//
const modelReducerInitialState = {};
function modelReducer (state = modelReducerInitialState, action) {
  return baseAPIReducer(state, action, 'MODEL');
}

export default combineReducers({ individualModels: modelReducer });
