// persistTransforms.ts
import {createTransform} from 'redux-persist';

export const omitLoadingAndErrorTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState, key) => {
    const {loading, error, ...rest} = inboundState;
    return rest; // only persist the rest
  },
  // transform state being rehydrated
  (outboundState, key) => {
    return outboundState;
  },
);
