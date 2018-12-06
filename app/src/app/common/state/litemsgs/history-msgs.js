import { ADD_HISTORY_MSG } from './index';

const historyMsgs = (state = [], { type, litemsg, blockId }) => {
  switch (type) {
    case ADD_HISTORY_MSG:
      return [...state, { litemsgId: litemsg.hash, blockId }];

    default:
      return state;
  }
};

export default historyMsgs;
