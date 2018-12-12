import ErrResponse from '../common/models/errResponse';
import NotificationEntry, { TYPE_TOAST } from '../common/state/notifications/notificationEntry';

/**
 * If success code (2XX), return the JSON payload. Otherwise, 
 * reject with an exception (ErrResponse) with the error JSON 
 * payload.
 * 
 * @param {*} res 
 */
const onResponse = (res) => {
  let payloadPromise = res.json();

  if (res.ok) { return payloadPromise; }
  return payloadPromise.then(payload => 
    Promise.reject(new ErrResponse(payload))
  );
}

const getPayload = onResponse;

/**
 * Convert an error response to a notification entry.
 * 
 * @param {*} errResponse 
 */
const toNotificationEntry = (errResponse, {
      title = 'Request Failed', 
      type = TYPE_TOAST, 
      timeout = 3000 } = {}) => {

  let message = null;
  if (!errResponse.status) {
    // not error with response code
    // again, later will refine this
    message = errResponse.message;
  } else {
    message = `${errResponse.status} | ${errResponse.message}`;
    if (errResponse.details) {
      message += ` | ${errResponse.details}`;
    }
  }
  return new NotificationEntry({ title, message, type, timeout });
};

export { onResponse, toNotificationEntry, getPayload };
