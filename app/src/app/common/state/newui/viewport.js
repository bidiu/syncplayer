import { SET_VIEWPORT_SIZE } from './index';

const getInitialState = () => ({
  width: null,
  height: null
});

const viewport = (state = getInitialState(), { type, width, height }) => {
  switch (type) {
    case SET_VIEWPORT_SIZE:
      return { width, height };

    default:
      return state;
  }
};

export default viewport;
