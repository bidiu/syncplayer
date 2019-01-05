import { UNSHIFT_ROOM, ADD_DEMO_ROOM, SYNC_ROOMS } from './index';

const rooms = (state = {}, { type, room, rooms }) => {
  switch (type) {
    case UNSHIFT_ROOM:
      return { ...state, [room.id]: room };

    case ADD_DEMO_ROOM:
      return { ...state, [room.id]: { ...room, demo: true } };

    case SYNC_ROOMS:
      return { ...rooms };

    default:
      return state;
  }
};

export default rooms;
