const UI_VIEWPORT_SET = 'UI_VIEWPORT_SET';
const VIEWPORT_MOBILE = 'VIEWPORT_MOBILE';
const VIEWPORT_IPAD = 'VIEWPORT_IPAD';
const VIEWPORT_DESKTOP = 'VIEWPORT_DESKTOP';

/**
 * set the ui viewport type
 */
const setUiViewport = (viewportType) => {
  return { type: UI_VIEWPORT_SET, payload: viewportType };
}

const getInitialState = () => {
  return {
    viewportType: VIEWPORT_DESKTOP
  };
}

const ui = (state, action) => {
  if (typeof state === 'undefined') { return getInitialState(); }

  let { type, payload } = action;

  switch (type) {
    case UI_VIEWPORT_SET:
      return { ...state, viewportType: payload };

    default:
      return state;
  }
}

export {
  setUiViewport, UI_VIEWPORT_SET, VIEWPORT_MOBILE, VIEWPORT_IPAD, VIEWPORT_DESKTOP
};

export default ui;
