const Node = require('./node');
const HandshakeManager = require('./handshake');
const ApiError = require('../common/models/api-errors');
const Room = require('./room');
const uuidv1 = require('uuid/v1');
const roomService = require('../services/room');
const createDebugServer = require('./debug-server');
const { getCurTimestamp } = require('../utils/time');
const {
  messageTypes, messageValidators, joinRoomFail,
  playerAction
} = require('./messages');

const defaultConfig = Object.freeze({
  httpServer: undefined,
  port: 1113,
  debug: false,
});

// refresh rate
const syncInterval = 5000;
// if a peer has joined a room for less than these seconds, 
// its `currentTime` won't be considered for sync other peers
const ignoreBefore = 10000;
// If greater than this, server will notify clients,
// but client can choose to ignore.
// Note that the unit here is second!
const minimumAcceptable = 1;

/**
 * The abstraction of the WebSocket server that's in
 * charge of synchronizaing clients. This class holds
 * most of the high level synchronization logic.
 * 
 * Note that client should upload progress info much more
 * often than server sending back progress data.
 */
class SyncServer {
  constructor(config) {
    this.handleJoinRoom = this.handleJoinRoom.bind(this);
    this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
    this.handlePlayerAction = this.handlePlayerAction.bind(this);
    this.handlePeerDisconnect = this.handlePeerDisconnect.bind(this);

    this.uuid = uuidv1();
    this.config = { ...defaultConfig, ...config };
    // create underlying node
    this.node = new Node(this.uuid, this.config);
    // create the handshake manager
    this.handshake = new HandshakeManager(this.node);
    // room id => room
    this.rooms = new Map();

    // debug server related
    if (this.config.debug) {
      let debugPort = this.node.debugPort;
      createDebugServer(this).listen(debugPort);
      console.log(`Debugging RESTful API server listening on port ${debugPort}.`);
    }

    this.timer = setInterval(() => {
      this.synchronize();
    }, syncInterval)

    // register handlers
    this.node.on(`message/${messageTypes.joinRoom}`, this.handleJoinRoom);
    this.node.on(`message/${messageTypes.leaveRoom}`, this.handleLeaveRoom);
    this.node.on(`message/${messageTypes.playerAction}`, this.handlePlayerAction);
    this.node.on('peerdisconnect', this.handlePeerDisconnect);
  }

  async handleJoinRoom({ messageType, ...payload }, peer) {
    try {
      messageValidators[messageType](payload);
    } catch (err) { console.warn(err); return; }

    let { roomId } = payload;
    let room = this.rooms.get(roomId);
    let now = getCurTimestamp();

    try {
      if (!room) {
        let { videoUrl: url, videoType: type } = await roomService.retrieve(roomId);
        room = new Room(roomId, { videoInfo: { url, type } });
        this.rooms.set(roomId, room);
      }
      // join the room
      peer.setProperty(roomId, {
        ping: 0, 
        currentTime: 0,
        timestamp: now
      });
      room.join(peer);

      if (!room.playerInfo.paused) {
        peer.sendJson(
          playerAction({ roomId, action: 'play', paused: false, timestamp: now })
        );
      }

    } catch (err) {
      if (!(err instanceof ApiError.NotFound)) {
        throw err;
      }
      peer.sendJson(
        joinRoomFail({ roomId, details: 'room doesn\'t exist' })
      );
    }
  }

  handleLeaveRoom({ messageType, ...payload }, peer) {
    try {
      messageValidators[messageType](payload);
    } catch (err) { console.warn(err); return; }

    let { roomId } = payload;
    let room = this.rooms.get(roomId);

    peer.deleteProperty(roomId);
    if (room && room.leave(peer) && room.isEmpty()) {
      room.close();
      this.rooms.delete(roomId);
    }
  }

  /**
   * TODO add message type to notify a room is closed or that you are kicked out
   * TODO considering ping
   */
  handlePlayerAction({ messageType, ...payload }, peer) {
    try {
      messageValidators[messageType](payload);
    } catch (err) { console.warn(err); return; }

    let { roomId, action, paused, currentTime, timestamp } = payload;
    let room = this.rooms.get(roomId);
    let now = getCurTimestamp();

    if (!room) {
      console.warn(`a peer is sending player action data to a nonexistent room (${roomId})`);
      return;
    }
    if (!room.peers.has(peer.uuid)) {
      console.warn(`a peer is sending player action data to a room it is not in (${roomId})`);
      return;
    }

    // `ping` here is one-way
    let ping = now - timestamp;
    peer.mergeProperty(roomId, { ping, currentTime, timestamp: now });

    switch (action) {
      case 'play':
      case 'pause':
        room.updatePlayerInfo({ paused, timestamp: now });
        room.broadcastMsg(playerAction({ roomId, action, paused, timestamp: now }), peer);
        break;

      case 'seeking':
        if (now - peer.joinAt >= ignoreBefore) {
          room.updatePlayerInfo({ currentTime, timestamp: now });
          room.broadcastMsg(playerAction({ roomId, action, currentTime, timestamp: now }), peer);
        }
        break;

      case 'time_update':
        // nothing here
        break;
    }
  }

  handlePeerDisconnect(peer) {
    for (let [roomId, room] of this.rooms.entries()) {
      peer.deleteProperty(roomId);
      if (room.leave(peer) && room.isEmpty()) {
        room.close();
        this.rooms.delete(roomId);
      }
    }
  }

  /**
   * Synchronization is a scheduled task being executed
   * at a fixed interval. Note that ontly `currentTime` 
   * will be synchronized here.
   */
  synchronize() {
    for (let [roomId, room] of this.rooms) {
      let now = getCurTimestamp();
      let { paused } = room.playerInfo;
      let nextCurrentTime = Number.MAX_SAFE_INTEGER;

      for (let peer of room.peers.values()) {
        let { currentTime, timestamp } = peer.getProperty(roomId);

        if (paused) {
          peer.mergeProperty(roomId, { timestamp: now });
        } else {
          // predict and update `currentTime` for each peer
          currentTime += ((now - timestamp) / 1000);
          peer.mergeProperty(roomId, { currentTime, timestamp: now });
        }

        // taking the smallest `currentTime` as the progress of the room
        if (now - peer.joinAt >= ignoreBefore && nextCurrentTime > currentTime) {
          nextCurrentTime = currentTime;
        }
      }
      if (nextCurrentTime === Number.MAX_SAFE_INTEGER) {
        nextCurrentTime = 0;
      }
      // update the player info on room (just for debug purposes)
      room.updatePlayerInfo({ currentTime: nextCurrentTime, timestamp: now });

      for (let peer of room.peers.values()) {
        let { currentTime } = peer.getProperty(roomId);

        if (Math.abs(nextCurrentTime - currentTime) > minimumAcceptable) {
          peer.sendJson(playerAction({
            roomId, 
            action: 'time_update', 
            paused, 
            currentTime: nextCurrentTime,
            timestamp: now
          }));
        }
      }
    }
  }

  /**
   * @param {string|Array<string>} nodeTypes pass `*` for matching all types
   */
  peers(nodeTypes = '*') {
    if (typeof nodeTypes === 'string' && nodeTypes !== '*') {
      nodeTypes = [nodeTypes];
    }

    let peers = this.node ? Object.values(this.node.peers) : [];
    return peers.filter(peer => nodeTypes === '*' || nodeTypes.includes(peer.nodeType));
  }

  /**
   * Do the cleanup.
   */
  close() {
    clearInterval(this.timer);
    this.node.close();
  }
}

module.exports = SyncServer;
