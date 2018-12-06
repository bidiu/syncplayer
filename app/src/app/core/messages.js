const messageTypes = Object.freeze({
  // handshake-related
  info: 'info',
  infoAck: 'info_ack',

  // room-related
  joinRoom: 'join_room',
  joinRoomFail: 'join_room_fail',
  leaveRoom: 'leave_room',

  // player related
  playerAction: 'player_action'
});

const palyerActions = Object.freeze(['play', 'pause', 'seeking', 'time_update']);

const info = ({ uuid, nodeType, daemonPort }) => ({
  messageType: messageTypes.info,
  uuid,
  nodeType,
  daemonPort
});

info.validate = (payload) => {
  let { uuid, nodeType, daemonPort } = payload;

  if (typeof uuid !== 'string') {
    throw new Error('invalid uuid');
  }
  if (nodeType && nodeType !== 'server' && nodeType !== 'client') {
    throw new Error('invalid node type');
  }
  if (daemonPort !== undefined && (typeof daemonPort !== 'number' 
      || daemonPort <= 1024 || daemonPort > 65535)) {
    throw new Error('invalid daemon port');
  }
  return payload;
};

const infoAck = () => ({
  messageType: messageTypes.infoAck
});

infoAck.validate = (payload) => {
  // nothing here
  return payload;
};

const joinRoom = ({ roomId }) => ({
  messageType: messageTypes.joinRoom,
  roomId
});

joinRoom.validate = (payload) => {
  let { roomId } = payload;

  if (typeof roomId !== 'string') {
    throw new Error('invalid room id');
  }
  return payload;
};

const joinRoomFail = ({ roomId, code, details }) => ({
  messageType: messageTypes.joinRoomFail,
  roomId,
  code,
  details
});

joinRoomFail.validate = (payload) => {
  // TODO
  return payload;
};

const leaveRoom = ({ roomId }) => ({
  messageType: messageTypes.leaveRoom,
  roomId
});

leaveRoom.validate = (payload) => {
  // TODO
  return payload;
};

/**
 * Note that for message sent to client, currentTime is optional in
 * case action is `play` and `pause`. Similarly, `paused` is not
 * given in case action is `seeking`.
 */
const playerAction = ({ roomId, action, paused, currentTime, timestamp }) => ({
  messageType: messageTypes.playerAction,
  roomId,
  action,
  paused,
  currentTime,
  timestamp
});

playerAction.validate = (payload) => {
  let { roomId, action, timestamp } = payload;

  if (typeof roomId !== 'string') {
    throw new Error('invalid room id');
  }
  if (!palyerActions.includes(action)) {
    throw new Error('invalid action');
  }
  // if (typeof paused !== 'boolean') {
  //   throw new Error('invalid paused');
  // }
  // if (typeof currentTime !== 'number' || currentTime < 0) {
  //   throw new Error('invalid current time');
  // }
  if (typeof timestamp !== 'number' || timestamp < 0) {
    throw new Error('invalid timestamp');
  }
  return payload;
};

// validators
const messageValidators = Object.freeze({
  [messageTypes.info]: info.validate,
  [messageTypes.infoAck]: infoAck.validate,
  [messageTypes.joinRoom]: joinRoom.validate,
  [messageTypes.joinRoomFail]: joinRoomFail.validate,
  [messageTypes.leaveRoom]: leaveRoom.validate,
  [messageTypes.playerAction]: playerAction.validate,
});

exports.messageTypes = messageTypes;
exports.messageValidators = messageValidators;

exports.info = info;
exports.infoAck = infoAck;
exports.joinRoom = joinRoom;
exports.joinRoomFail = joinRoomFail;
exports.leaveRoom = leaveRoom;
exports.playerAction = playerAction;
