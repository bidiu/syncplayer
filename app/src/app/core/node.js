const EventEmitter = require('wolfy87-eventemitter');
const WSClient = require('./wsc');
const { getSocketAddress } = require('../utils/network');

/**
 * #### Events
 * - `socketconnect` - low level socket connection (simple wrapper around wss's)
 * - `peerconnect` - high level peer connection
 * - `peerdisconnect` - high level peer disconnection
 * - `message/${message_type}` - high level protocol-specific messages
 * 
 * All other events are handled by low level abstraction, so you don't need to
 * worry about : P
 */
class Node extends EventEmitter {
  constructor(uuid) {
    super();
    this.socketConnectHandler = this.socketConnectHandler.bind(this);
    this.socketMessageHandler = this.socketMessageHandler.bind(this);
    this.socketCloseHandler = this.socketCloseHandler.bind(this);

    this.uuid = uuid;
    // node's uuid => peer
    this.peers = {};
    // remote socket addresses (str) => peers
    this.socketsToPeers = {};

    // create the underlyng websocket server
    this.wss = new WSClient();
    // when new connection established
    this.wss.on('connection', this.socketConnectHandler);
  }

  /**
   * Create a proxy to intercept the `send` function call,
   * mainly for debugging / logging.
   */
  createSocketProxy(socket, remoteUuid) {
    return socket;
  }

  /**
   * Note that you cannot have more than one socket to a single URL.
   * And also note that error could be thrown if url is invalid.
   * Failure of connection will only cause some log (won't crash
   * the application).
   * 
   * Right now, there's no way to get notified when it fail to connect
   * (such as because of timeout) except for a log mentioned before.
   */
  createConnection(url) {
    return this.wss.createConnection(url);
  }

  /**
   * @param {string} msg 
   * @param {Array<string>} exUuids 
   */
  broadcast(msg, exUuids = []) {
    let peers = Object.keys(this.peers)
      .filter(uuid => !exUuids.includes(uuid))
      .map(uuid => this.peers[uuid]);

    for (let peer of peers) {
      try {
        peer.send(msg);
      } catch (err) {
        console.error(err);
      }
    }
  }

  /**
   * @param {Object} jsonObj 
   * @param {Array<string>} exUuids 
   */
  broadcastJson(jsonObj, exUuids) {
    this.broadcast(JSON.stringify(jsonObj), exUuids);
  }

  socketConnectHandler(socket, incoming) {
    let socketAddress = getSocketAddress(socket);
    if (incoming) {
      console.log(`Accepted socket connection from ${socketAddress}.`);
    } else {
      console.log(`Established socket connection to ${socketAddress}.`);
    }

    socket.on('close', (code, reason) =>
      this.socketCloseHandler(code, reason, socket));

    // notify listeners
    this.emit('socketconnect', socket, incoming);
  }

  socketMessageHandler(msg, peer) {
    let msgObj = null;
    try { msgObj = JSON.parse(msg); } catch (e) {}
    
    if (msgObj && msgObj['messageType']) {
      this.emit(`message/${msgObj['messageType']}`, msgObj, peer);
    }
  }

  socketCloseHandler(code, reason, socket) {
    let socketAddress = getSocketAddress(socket);
    let peer = this.socketsToPeers[socketAddress]

    if (peer) {
      delete this.peers[peer.uuid];
      delete this.socketsToPeers[socketAddress]
      console.log(`Disconnected from ${peer.uuid}@${socketAddress}.`);
      // notify listeners
      this.emit('peerdisconnect', peer);
    }
    console.log(`Closed socket connection with ${socketAddress} (${code || 'N/A'} | ${reason || 'N/A'}).`);
  }

  /**
   * Add new peer to peer collection of this node. The protocol
   * implmementation should call this after a protocol-specific
   * handshake completes (this class is protocol agnostic).
   */
  addNewPeer(peer) {
    let { uuid, socket, incoming, nodeType } = peer;
    let socketAddress = getSocketAddress(socket);

    if (this.peers.hasOwnProperty(uuid)) {
      console.warn(`Established connection with a connected peer (${uuid}@${socketAddress});\n`
        + `so, going to disconnect from it.`);
      socket.close(undefined, 'DOUBLE_CONNECT');
      return;
    }

    peer.socket = socket = this.createSocketProxy(socket, uuid);
    this.peers[uuid] = peer;
    this.socketsToPeers[socketAddress] = peer;
    socket.on('data', (message) => 
      this.socketMessageHandler(message, peer));

    if (incoming) {
      console.log(`Accepted connection from ${peer.uuid}@${socketAddress} (${nodeType}).`);
    } else {
      console.log(`Established connection to ${peer.uuid}@${socketAddress} (${nodeType}).`);
    }

    // notify listeners
    this.emit('peerconnect', peer);
  }

  /**
   * Get some useful information about this node.
   */
  getInfo() {
    let network = this.wss.getInfo();

    if (network.sockets) {
      for (let socketInfo of network.sockets) {
        let peer = this.socketsToPeers[socketInfo.remoteSocketAddr];

        socketInfo.remoteUuid = peer.uuid;
        socketInfo.remoteDaemonPort = peer.daemonPort;
      }
    }

    return {
      uuid: this.uuid,
      network,
    };
  }

  /**
   * Close this node (both server and outgoing socket connections will
   * be closed)
   */
  close() {
    this.removeAllListeners();
    this.wss.close();
  }
}

module.exports = Node;
