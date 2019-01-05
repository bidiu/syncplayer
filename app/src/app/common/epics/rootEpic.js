import { combineEpics } from 'redux-observable';
import removePendingMsgEpic from './rm-pending-msg';
import addLitemsgEpic from './add-litemsg';
import persistRoomsEpic from './persist-rooms';

const rootEpic = combineEpics(
  removePendingMsgEpic,
  addLitemsgEpic,
  persistRoomsEpic,
);

export default rootEpic;
