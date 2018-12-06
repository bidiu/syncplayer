const NONE = 'NONE';

/**
 * Act as like 'dev/null', any NONE action triggers nothing.
 */
const none = () => ({ type: NONE, payload: {} });

const overall = (state = {}, action) => {
  let { type } = action;

  switch (type) {
    case NONE:
      // do nothing
      return state;

    default:
      return state;
  }
};

export { none, NONE };

export default overall;
