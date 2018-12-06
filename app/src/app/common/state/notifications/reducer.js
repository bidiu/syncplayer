const NOTIFICATION_ADD = 'NOTIFICATION_ADD';
const NOTIFICATION_REMOVE = 'NOTIFICATION_REMOVE';

/**
 * add an entry to the notification list
 */
const addNotification = (entry) => {
  return { type: NOTIFICATION_ADD, payload: entry };
}

/**
 * remove an entry from the notification list
 */
const removeNotification = (entryId) => {
  return { type: NOTIFICATION_REMOVE, payload: entryId };
}

/**
 * `state` is an entry list with both banner and toast types
 */
const notifications = (state = [], action) => {
  let payload = action.payload;

  switch (action.type) {
    case NOTIFICATION_ADD:
      return [...state, payload];

    case NOTIFICATION_REMOVE:
      let i = state.findIndex(entry => payload === entry.id);
      if (i === undefined) { return state; }
      return [...state.slice(0, i), ...state.slice(i + 1)];

    default:
      return state;
  }
}

export {
  addNotification, NOTIFICATION_ADD,
  removeNotification, NOTIFICATION_REMOVE
};

export { NotificationEntry, TYPE_BANNER, TYPE_TOAST } from './notificationEntry';

export default notifications;
