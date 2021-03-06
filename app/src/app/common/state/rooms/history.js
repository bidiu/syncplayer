import { UNSHIFT_ROOM, SYNC_ROOMS, CLEAR_ROOMS } from './index';

const history = (state = [], { type, room, history }) => {
  switch (type) {
    case UNSHIFT_ROOM:
      return [room.id, ...state];

    case SYNC_ROOMS:
      return [...history];

    case CLEAR_ROOMS:
      return [];

    default:
      return state;
  }
};

export default history;
