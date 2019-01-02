const { getSocketAddress, getSocketInfo, getReadyState } = require('../utils/network');
const EventEmitter = require('wolfy87-eventemitter');
// simple-websocket is an event-emitter based websocket
// implementation, which supports running in browser
const WebSocket = require('simple-websocket');

// shim some methods
Object.getPrototypeOf(WebSocket).close = function () {
  this.destroy();
};
Object.getPrototypeOf(WebSocket).terminate = function () {
  this.destroy();
};

/**
 * Provide abstraction for underlaying transportation protocol. It behaves 
 * both like a server and a client - it will connect to several clients, 
 * and also several servers (P2P network).
 * 
 * The P2P network is a directed graph with bidirectional communication channels.
 * 
 * ##### Events
 * - `connection` (socket, incoming) - low level socket connection
 * 
 * For all other events, use the underlying web socket object.
 * 
 * TODO shim ping/pong for browser env
 */
class WSClient extends EventEmitter {
  constructor() {
    super();
    this.connectionHandler = this.connectionHandler.bind(this);
    
    // map remote socket addresses (ip:port) to sockets
    this.servers = {};
  }

  /**
   * Note that you cannot have more than one socket to a single URL.
   * And also note that error could be thrown if url is invalid.
   * Failure of connection will only cause some logs (won't crash
   * the application).
   * 
   * Right now, there's no way to get notified when it fails to connect
   * (such as because of timeout) except for a log mentioned before.
   */
  createConnection(url) {
    let socketAddress = null;
    let remoteDaemonPort = null;
    try {
      ({ host: socketAddress, port: remoteDaemonPort } = new URL(url));
      if (remoteDaemonPort === '') { remoteDaemonPort = '80'; }
      if (!socketAddress || !remoteDaemonPort.match(/^\d+$/)) { throw new Error(); }
    } catch (err) {
      throw new Error(`Wrong url (${url}) to connect.`);
    }

    let prevSocket = this.servers[socketAddress];
    if (prevSocket && this.socketAlive(prevSocket)) {
      console.warn(`Tried to connect to same url (${url}) twice. Operation aborted.`);
      return;
    }

    let socket = new WebSocket(url, { handshakeTimeout: 10000 });

    socket.on('error', (err) =>
      console.log(`Unable to establish connection to ${url}. Details:\n${err}.`));

    socket.on('connect', () => {
      let prevSocket = this.servers[socketAddress];
      if (prevSocket && this.socketAlive(prevSocket)) {
        // TODO investigate memory leak
        socket.on('close', () => socket.removeAllListeners());
        socket.close(undefined, 'DOUBLE_CONNECT');
        return;
      }
      socket.removeAllListeners('error');
      this.connectionHandler(socket, false);
      this.servers[socketAddress] = socket;
    });
  }

  genHeartbeat() {
    let noop = () => {};
    return () => {
      for (let socket of Object.values(this.servers)) {
        if (this.socketAbnormal(socket)) {
          socket.terminate();
        }
        // set socket `alive` to false, later pong response
        // from client will recover `alive` from false to true
        socket.alive = false;
        socket.ping(noop);
      }
    }
  }

  /**
   * @param {*} socket                  the underlaying socket
   * @param {boolean} incoming          whether the connection is incoming
   */
  connectionHandler(socket, incoming) {
    let socketAddress = getSocketAddress(socket);
    socket.alive = true;
    socket.on('message', () => socket.alive = true);
    socket.on('pong', () => socket.alive = true);
    socket.on('close', () => {
      socket.alive = false;
      socket.removeAllListeners();
      if (socket === this.servers[socketAddress]) {
        delete this.servers[socketAddress];
      }
    });
    socket.on('error', err => {
      console.log(err);
      socket.terminate();
    });
    // notify subscribers
    this.emit('connection', socket, incoming);
  }

  socketAbnormal(socket) {
    return !socket.alive && getReadyState(socket) === WebSocket.OPEN;
  }

  socketAlive(socket) {
    return getReadyState(socket) === WebSocket.OPEN;
  }

  /**
   * Get some useful information about the network.
   */
  getInfo() {
    let sockets = [];

    for (let socket of Object.values(this.servers)) {
      sockets.push({
        dir: 'outbound',
        ...getSocketInfo(socket)
      });
    }

    return {
      sockets
    };
  }

  /**
   * Close this node (both server and outgoing socket connections will
   * be closed)
   */
  close() {
    this.removeAllListeners();
    clearInterval(this.timer);
  }
}

module.exports = WSClient;
