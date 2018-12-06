import { removePendingMsg, SET_BLOCK_ID } from '../state/litemsgs/index';

const delay = 5000;

const removePendingMsgEpic = (action$, store) =>
  action$.ofType(SET_BLOCK_ID)
    .delay(delay)
    .map(({ litemsgId }) => {
      let pendingEntry = store.getState().litemsgs.pendingQueue
        .find(e => e.litemsg && e.litemsg.hash === litemsgId);

      return removePendingMsg(pendingEntry.pendingId);
    });

export default removePendingMsgEpic;
