import { ADD_DEMO_ROOM } from './index';

const demo = (state = null, { type, room }) => {
  switch (type) {
    case ADD_DEMO_ROOM:
      return room.id;

    default:
      return state;
  }
};

export default demo;
