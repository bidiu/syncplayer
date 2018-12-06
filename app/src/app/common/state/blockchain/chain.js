import {
  PUSH_BLOCKS, UNSHIFT_BLOCKS, SWITCH_BRANCH
} from './index';

const chain = (state = [], { type, blocks }) => {
  switch (type) {
    case PUSH_BLOCKS:
      return [...state, ...(blocks.map(block => block.hash))];

    case UNSHIFT_BLOCKS:
      for (let { hash } of blocks) {
        if (state.includes(hash)) {
          return state;
        }
      }
      return [...(blocks.map(block => block.hash)), ...state];

    case SWITCH_BRANCH:
      let hashes = blocks.map(block => block.hash);
      // the index of previous block on `state` array
      let i = blocks[0].height - state[0].height - 1;
      if (state[i] && state[i].hash === blocks[0].prevBlock) {
        return [...state.slice(0, i + 1), ...hashes];
      } else {
        return hashes;
      }

    default:
      return state;
  }
};

export default chain;
