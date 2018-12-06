import  { SET_PEERS } from './index';

const peers = (state = [], { type, peers }) => {
  switch (type) {
    case SET_PEERS:
      return peers;

    default:
      return state;
  }
};

export default peers;
