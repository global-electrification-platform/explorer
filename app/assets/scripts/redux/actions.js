import { fetchDispatchCacheFactory } from './utils';
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
