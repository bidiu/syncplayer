import { SET_TAB, UNSET_TAB } from './index';

const tab = (state = null, { type, tab }) => {
  switch (type) {
    case SET_TAB:
      return tab;

    case UNSET_TAB:
      return null;

    default:
      return state;
  }
};

export default tab;
