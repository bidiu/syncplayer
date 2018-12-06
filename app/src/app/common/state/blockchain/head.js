import {
  PUSH_BLOCKS, SWITCH_BRANCH
} from './index';

const head = (state = null, { type, blocks }) => {
  switch (type) {
    case PUSH_BLOCKS:
    case SWITCH_BRANCH:
      return blocks.slice(-1)[0].hash;

    default:
      return state;
  }
};

export default head;
