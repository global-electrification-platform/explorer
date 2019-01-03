import qs from 'qs';

import { fetchDispatchCacheFactory, fetchDispatchFactory } from './utils';
import { dataServiceUrl } from '../config';

/*
 * Actions for Models
 */

export const REQUEST_MODEL = 'REQUEST_MODEL';
export const RECEIVE_MODEL = 'RECEIVE_MODEL';
export const INVALIDATE_MODEL = 'INVALIDATE_MODEL';

export function invalidateModel (modelId) {
  return { type: INVALIDATE_MODEL, id: modelId };
}

export function requestModel (modelId) {
  return { type: REQUEST_MODEL, id: modelId };
}

export function receiveModel (modelId, data, error = null) {
  return {
    type: RECEIVE_MODEL,
    id: modelId,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchModel (modelId) {
  return fetchDispatchCacheFactory({
    statePath: ['individualModels', modelId],
    url: `${dataServiceUrl}/models/${modelId}`,
    requestFn: requestModel.bind(this, modelId),
    receiveFn: receiveModel.bind(this, modelId)
  });
}

/*
 * Actions for Scenarios
 */

export const REQUEST_SCENARIO = 'REQUEST_SCENARIO';
export const RECEIVE_SCENARIO = 'RECEIVE_SCENARIO';
export const INVALIDATE_SCENARIO = 'INVALIDATE_SCENARIO';

export function invalidateScenario () {
  return { type: INVALIDATE_SCENARIO };
}

export function requestScenario () {
  return { type: REQUEST_SCENARIO };
}

export function receiveScenario (data, error = null) {
  const layers = {};
  const featureTypes = data.featureTypes ? data.featureTypes.split(',') : [];

  // Parse feature id by type
  for (let i = 0; i < featureTypes.length; i++) {
    const type = featureTypes[i];

    if (type.length > 0) {
      if (typeof layers[type] === 'undefined') layers[type] = [];
      layers[type].push(i);
    }
  }
  data.layers = layers;
  delete data.featureTypes;

  return {
    type: RECEIVE_SCENARIO,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchScenario (scenarioId, filters, year) {
  const queryString = qs.stringify({
    filters,
    year
  }, { addQueryPrefix: true, skipNulls: true });

  return fetchDispatchFactory({
    statePath: ['scenario'],
    url: `${dataServiceUrl}/scenarios/${scenarioId}${queryString}`,
    requestFn: requestScenario,
    receiveFn: receiveScenario
  });
}

/*
 * Actions for Stats
 */

export const REQUEST_STATS = 'REQUEST_STATS';
export const RECEIVE_STATS = 'RECEIVE_STATS';
export const INVALIDATE_STATS = 'INVALIDATE_STATS';

export function invalidateStats () {
  return { type: INVALIDATE_STATS };
}

export function requestStats () {
  return { type: REQUEST_STATS };
}

export function receiveStats (data, error = null) {
  return {
    type: RECEIVE_STATS,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchStats () {
  return fetchDispatchCacheFactory({
    statePath: 'stats',
    url: `${dataServiceUrl}/stats`,
    requestFn: requestStats,
    receiveFn: receiveStats
  });
}

/*
 * Actions for Countries
 */

export const REQUEST_COUNTRIES = 'REQUEST_COUNTRIES';
export const RECEIVE_COUNTRIES = 'RECEIVE_COUNTRIES';
export const INVALIDATE_COUNTRIES = 'INVALIDATE_COUNTRIES';

export function invalidateCountries () {
  return { type: INVALIDATE_COUNTRIES };
}

export function requestCountries () {
  return { type: REQUEST_COUNTRIES };
}

export function receiveCountries (data, error = null) {
  return {
    type: RECEIVE_COUNTRIES,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchCountries () {
  return fetchDispatchCacheFactory({
    statePath: 'countries',
    url: `${dataServiceUrl}/countries`,
    requestFn: requestCountries,
    receiveFn: receiveCountries,
    // Convert to array.
    mutator: res => res.countries
  });
}

/*
 * Actions for indiviadul Countries
 */

export const REQUEST_COUNTRY = 'REQUEST_COUNTRY';
export const RECEIVE_COUNTRY = 'RECEIVE_COUNTRY';
export const INVALIDATE_COUNTRY = 'INVALIDATE_COUNTRY';

export function invalidateCountry (iso) {
  return { type: INVALIDATE_COUNTRY, id: iso };
}

export function requestCountry (iso) {
  return { type: REQUEST_COUNTRY, id: iso };
}

export function receiveCountry (iso, data, error = null) {
  return {
    type: RECEIVE_COUNTRY,
    id: iso,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchCountry (iso) {
  return fetchDispatchCacheFactory({
    statePath: ['individualCountries', iso],
    url: `${dataServiceUrl}/countries/${iso}`,
    receiveFn: receiveCountry.bind(this, iso),
    requestFn: requestCountry.bind(this, iso)
  });
}

/*
 * Actions for indiviadul Features
 */

export const REQUEST_FEATURE = 'REQUEST_FEATURE';
export const RECEIVE_FEATURE = 'RECEIVE_FEATURE';
export const INVALIDATE_FEATURE = 'INVALIDATE_FEATURE';

export function invalidateFeature (key) {
  return { type: INVALIDATE_FEATURE, id: key };
}

export function requestFeature (key) {
  return { type: REQUEST_FEATURE, id: key };
}

export function receiveFeature (key, data, error = null) {
  return {
    type: RECEIVE_FEATURE,
    id: key,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchFeature (scenarioId, featureId) {
  const key = `${scenarioId}--${featureId}`;

  return fetchDispatchCacheFactory({
    statePath: ['individualFeatures', key],
    url: `${dataServiceUrl}/scenarios/${scenarioId}/features/${featureId}`,
    receiveFn: receiveFeature.bind(this, key),
    requestFn: requestFeature.bind(this, key)
  });
}
