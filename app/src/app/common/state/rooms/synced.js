import { SYNC_ROOMS } from './index';

const synced = (state = false, { type }) => {
  switch (type) {
    case SYNC_ROOMS:
      return true;

    default:
      return state;
  }
};

export default synced;
