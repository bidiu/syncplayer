import { combineReducers } from 'redux';
import overall from './overall/reducer';
import ui from './ui/reducer';
import notifications from './notifications/reducer';
import newui from './newui/index';
import blockchain from './blockchain/index';
import litemsgs from './litemsgs/index';
import rooms from './rooms/index';

const rootReducer = combineReducers({
  overall, ui, newui, notifications, blockchain, litemsgs,
  rooms
});

export default rootReducer;
