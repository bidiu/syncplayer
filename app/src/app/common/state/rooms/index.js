import { combineReducers } from 'redux';
import { genActionCreator, genActionTypeCreator } from '../../../utils/stateUtils';

import { default as _rooms } from './rooms';
import history from './history';
import demo from './demo';
import synced from './synced';

const genActionType = genActionTypeCreator('rooms');

// action types
const UNSHIFT_ROOM = genActionType('unshift_room');
const ADD_DEMO_ROOM = genActionType('add_demo_room');
const SYNC_ROOMS = genActionType('sync_rooms');

// actions
const unshiftRoom = genActionCreator(UNSHIFT_ROOM, 'room');
const addDemoRoom = genActionCreator(ADD_DEMO_ROOM, 'room');
const syncRooms = genActionCreator(SYNC_ROOMS, 'rooms', 'history');

const rooms = combineReducers({ rooms: _rooms, history, demo, synced });

export {
  unshiftRoom, UNSHIFT_ROOM,
  addDemoRoom, ADD_DEMO_ROOM,
  syncRooms, SYNC_ROOMS,
};

export default rooms;
