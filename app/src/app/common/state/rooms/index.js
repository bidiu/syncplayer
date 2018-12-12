import { combineReducers } from 'redux';
import { genActionCreator, genActionTypeCreator } from '../../../utils/stateUtils';

import { default as _rooms } from './rooms';
import history from './history';
import demo from './demo'

const genActionType = genActionTypeCreator('rooms');

// action types
const UNSHIFT_ROOM = genActionType('unshift_room');
const ADD_DEMO_ROOM = genActionType('add_demo_room');

// actions
const unshiftRoom = genActionCreator(UNSHIFT_ROOM, 'room');
const addDemoRoom = genActionCreator(ADD_DEMO_ROOM, 'room');

const rooms = combineReducers({ rooms: _rooms, history, demo });

export {
  unshiftRoom, UNSHIFT_ROOM,
  addDemoRoom, ADD_DEMO_ROOM,
};

export default rooms;
