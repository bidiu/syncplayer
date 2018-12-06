import {
  PUSH_BLOCKS, UNSHIFT_BLOCKS, SWITCH_BRANCH, UPDATE_BLOCK
} from './index';

const blocks = (state = {}, { type, blocks, block }) => {
  switch (type) {
    case PUSH_BLOCKS:
    case UNSHIFT_BLOCKS:
    case SWITCH_BRANCH:
      let nextState = { ...state };
      for (let block of blocks) {
        if (!nextState[block.hash]) {
          nextState[block.hash] = block;
        }
      }
      return nextState;

    case UPDATE_BLOCK:
      return { ...state, [block.hash]: block };

    default:
      return state;
  }
};

export default blocks;
