import { UNSHIFT_ROOM, ADD_DEMO_ROOM } from './index';

const rooms = (state = {}, { type, room }) => {
  switch (type) {
    case UNSHIFT_ROOM:
      return { ...state, [room.id]: room };

    case ADD_DEMO_ROOM:
      return { ...state, [room.id]: { ...room, demo: true } };

    default:
      return state;
  }
};

export default rooms;
