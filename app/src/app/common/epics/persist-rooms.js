import { UNSHIFT_ROOM } from '../state/rooms/index';
import { none } from '../state/overall/reducer';

const persistRoomsEpic = (action$, store) =>
  action$.ofType(UNSHIFT_ROOM)
    .map(() => {
      let { rooms } = store.getState();
      window.localStorage.setItem('rooms', JSON.stringify(rooms));
      return none();
    });

export default persistRoomsEpic;
