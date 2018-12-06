import { addHistoryMsg, SET_BLOCK_ID } from '../state/litemsgs/index';

const addLitemsgEpic = (action$, store) =>
  action$.ofType(SET_BLOCK_ID)
    .map(({ litemsgId }) => {
      let { litemsg, blockId } = store.getState().litemsgs.pendingQueue
        .find(e => e.litemsg && e.litemsg.hash === litemsgId);

      return addHistoryMsg(litemsg, blockId);
    });

export default addLitemsgEpic;
