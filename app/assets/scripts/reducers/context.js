import { REHYDRATE } from 'redux-persist';

export const CONTEXT_UPDATE = 'context/UPDATE';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      const context = action.payload ? action.payload.context : {};
      return Object.assign({}, state, context, { rehydrated: true });
    }
    default:
      return state;
  }
};
