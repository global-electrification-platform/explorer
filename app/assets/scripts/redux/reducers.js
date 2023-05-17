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

// ELECTRICITY_MIX Reducer

const electricityMixReducerInitialState = {
  fetched: false,
  fetching: false,
  data: {},
  error: null
};
function electricityMixReducer (state = electricityMixReducerInitialState, action) {
  return baseAPIReducer(state, action, 'ELECTRICITY_MIX');
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

//
//  COUNTRIES Reducer
//
const countriesReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: []
};
function countriesReducer (state = countriesReducerInitialState, action) {
  return baseAPIReducer(state, action, 'COUNTRIES');
}

//
//  COUNTRY Reducer
//
const countryReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: []
};
function countryReducer (state = countryReducerInitialState, action) {
  return baseAPIReducer(state, action, 'COUNTRY');
}

//
//  FEATURE Reducer
//
const featureReducerInitialState = {
  // fetching: false,
  // fetched: false,
  // error: null,
  // data: []
};
function featureReducer (state = featureReducerInitialState, action) {
  return baseAPIReducer(state, action, 'FEATURE');
}

//
//  ABOUT PAGE Reducer
//
const aboutPageReducerInitialState = {
  // fetching: false,
  // fetched: false,
  // error: null,
  // data: []
};
function aboutPageReducer (state = aboutPageReducerInitialState, action) {
  return baseAPIReducer(state, action, 'ABOUT_PAGE');
}

export default combineReducers({
  scenario: scenarioReducer,
  electricityMix: electricityMixReducer,
  individualModels: modelReducer,
  stats: statsReducer,
  countries: countriesReducer,
  individualCountries: countryReducer,
  individualFeatures: featureReducer,
  individualAboutPages: aboutPageReducer
});
