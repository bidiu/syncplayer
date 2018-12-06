import { combineEpics } from 'redux-observable';
import removePendingMsgEpic from './rm-pending-msg';
import addLitemsgEpic from './add-litemsg';

const rootEpic = combineEpics(
  removePendingMsgEpic,
  addLitemsgEpic
);

export default rootEpic;
