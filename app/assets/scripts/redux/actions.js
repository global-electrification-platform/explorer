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
