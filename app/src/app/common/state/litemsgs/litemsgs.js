import { ADD_LITEMSG, ADD_HISTORY_MSG } from './index';

const litemsgs = (state = {}, { type, litemsg }) => {
  switch (type) {
    case ADD_LITEMSG:
    case ADD_HISTORY_MSG:
      return { ...state, [litemsg.hash]: litemsg };

    default:
      return state;
  }
};

export default litemsgs;
