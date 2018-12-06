import {
  SET_MSG, SEND_MSG, RESET_MSG, SET_BLOCK_ID, 
  TIMEOUT_MSG, REMOVE_PENDING_MSG
} from './index';

const genNewPendingMsg = (pendingId) => ({
  pendingId, 
  litemsg: null,
  sentAt: null,
  timeout: false,
  blockId: null
});

const getInitialState = () => [genNewPendingMsg('initial_pending_msg')];

const pendingQueue = (state = getInitialState(), { type, ...payload }) => {
  let {
    litemsg, pendingId, nextPendingId, blockId, litemsgId, sentAt
  } = payload;

  switch(type) {
    case SET_MSG:
      return [
        genNewPendingMsg(nextPendingId),
        { ...state[0], litemsg },
        ...state.slice(1)
      ];

    case SEND_MSG:
      let i = state.map(e => e.pendingId).indexOf(pendingId);
      return [
        ...state.slice(0, i),
        { ...state[i], sentAt },
        ...state.slice(i + 1)
      ];

    case RESET_MSG:
      i = state.map(e => e.pendingId).indexOf(pendingId);
      return [
        ...state.slice(0, i),
        { ...state[i], sentAt: null, timeout: false },
        ...state.slice(i + 1)
      ];

    case TIMEOUT_MSG:
      i = state.map(e => e.pendingId).indexOf(pendingId);
      return [
        ...state.slice(0, i),
        { ...state[i], timeout: true },
        ...state.slice(i + 1)
      ];

    case SET_BLOCK_ID:
      i = state.map(e => e.litemsg ? e.litemsg.hash : undefined).indexOf(litemsgId);
      return [
        ...state.slice(0, i),
        { ...state[i], blockId },
        ...state.slice(i + 1)
      ];

    case REMOVE_PENDING_MSG:
      i = state.map(e => e.pendingId).indexOf(pendingId);
      return [
        ...state.slice(0, i),
        ...state.slice(i + 1)
      ];

    default:
      return state;
  }
};

export default pendingQueue;
