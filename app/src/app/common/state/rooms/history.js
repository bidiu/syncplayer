import { UNSHIFT_ROOM } from './index';

const history = (state = [], { type, room }) => {
  switch (type) {
    case UNSHIFT_ROOM:
      return [room.id, ...state];

    default:
      return state;
  }
};

export default history;
