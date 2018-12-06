import { SET_SCROLLBAR_WIDTH, HIDE_SCROLLBAR, SHOW_SCROLLBAR } from './index';

/**
 * Note that hide is true only if when document's scroll height
 * is bigger than the viewport's height. For simiplicity, the
 * `scrollbar` here is the y-axis scrollbar.
 */
const getInitialState = () => ({
  width: 0,
  hide: false
})

const scrollbar = (state = getInitialState(), { type, width }) => {
  switch (type) {
    case SET_SCROLLBAR_WIDTH:
      return { ...state, width };

    case HIDE_SCROLLBAR:
      return { ...state, hide: true };

    case SHOW_SCROLLBAR:
      return { ...state, hide: false };

    default:
      return state;
  }
};

export default scrollbar;
