import EventEmitter from 'wolfy87-eventemitter';
import Node from './node';
import HandshakeManager from './handshake';
import uuidv1 from 'uuid/v1';
import { getCurTimestamp } from '../utils/time';
import {
  messageTypes, messageValidators, joinRoom, leaveRoom,
  playerAction
} from './messages';

const defaultConfig = Object.freeze({
  syncServerUrl: undefined
});

/**
 * Events:
 * -  `play`        roomId
 * -  `pause`       roomId
 * -  `seeking`     roomId, currentTime, timestamp
 * -  `timeupdate`  roomid, paused, currentTime, timestapm
 * 
 * -  `connect`     peer
 * -  `disconnect`  peer
 */
class SyncClient extends EventEmitter {
  constructor(config) {
    super();
    this.uuid = uuidv1();
    this.config = { ...defaultConfig, ...config };
    
    // create underlying node
    this.node = new Node(this.uuid);
    // create the handshake manager
    this.handshake = new HandshakeManager(this.node);
    // pending rooms to join right after connected to sync server
    this.pendingRoomIds = [];

    this.node.on(`message/${messageTypes.playerAction}`, this.handlePlayerAction);
    this.node.on('peerconnect', this.handlePeerConnect);
    this.node.on('peerdisconnect', this.handlePeerDisconnect);
  }

  /**
   * Call this function to connect with sync server.
   * 
   * TODO add events of connected or failure
   */
  connect() {
    // connect to the sync server
    this.node.createConnection(this.config.syncServerUrl);

    let timer = setInterval(() => {

      if (this.isConnected()) {
        clearInterval(timer);
        this.pendingRoomIds.forEach(roomId => this.joinRoom(roomId));
        this.pendingRoomIds = [];
      }
    }, 1000);
  }

  isConnected() {
    return this.peers().length !== 0;
  }

  /**
   * A peer will be returned, or null if unconnected.
   */
  getSyncServer() {
    return this.isConnected() ? this.peers()[0] : null;
  }

  /**
   * If not connected yet, joining will happen as soon as
   * client is connected to sync server after.
   * 
   * TODO when failure happens
   */
  joinRoom(roomId) {
    if (this.isConnected()) {
      this.getSyncServer().sendJson(joinRoom({ roomId }));
    } else {
      this.pendingRoomIds.push(roomId);
    }
  }

  leaveRoom(roomId) {
    if (this.isConnected()) {
      this.getSyncServer().sendJson(leaveRoom({ roomId }));
    }
  }

  play(roomId, currentTime) {
    if (this.isConnected()) {
      this.getSyncServer().sendJson(playerAction({
        roomId, action: 'play', paused: false, currentTime, timestamp: getCurTimestamp()
      }));
    }
  }

  pause(roomId, currentTime) {
    if (this.isConnected()) {
      this.getSyncServer().sendJson(playerAction({
        roomId, action: 'pause', paused: true, currentTime, timestamp: getCurTimestamp()
      }));
    }
  }

  seek(roomId, paused, currentTime) {
    if (this.isConnected()) {
      this.getSyncServer().sendJson(playerAction({
        roomId, action: 'seeking', paused, currentTime, timestamp: getCurTimestamp()
      }));
    }
  }

  updateTime(roomId, paused, currentTime) {
    if (this.isConnected()) {
      this.getSyncServer().sendJson(playerAction({
        roomId, action: 'time_update', paused, currentTime, timestamp: getCurTimestamp()
      }));
    }
  }

  handlePlayerAction = ({ messageType, ...payload }, peer) => {
    try {
      messageValidators[messageType](payload);
    } catch (err) { console.warn(err); return; }

    let { roomId, action, paused, currentTime, timestamp } = payload;

    switch (action) {
      case 'play':
        this.emit('play', roomId, timestamp);
        break;

      case 'pause':
        this.emit('pause', roomId, timestamp);
        break;

      case 'seeking':
        this.emit('seeking', roomId, currentTime, timestamp);
        break;

      case 'time_update':
        this.emit('time_update', roomId, paused, currentTime, timestamp);
        break;

      default:
        break;
    }
  };

  /**
   * connected with the server
   */
  handlePeerConnect = (peer) => {
    this.emit('connect', peer);
  };

  /**
   * disconnected from the server
   * 
   * TODO auto reconnect
   */
  handlePeerDisconnect = (peer) => {
    this.emit('disconnect', peer);
  };

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
   * Do the cleanup. After, the object could not be used
   * anymore.
   */
  close() {
    this.removeAllListeners();
    this.node.close();
  }
}

export default SyncClient;
