const EventEmitter = require('events');
const WebSocket = require('ws');
const { URL } = require('url');
const { getSocketAddress, getSocketInfo } = require('../utils/network');

/**
 * Provide abstraction for underlaying transportation protocol. It behaves 
 * both like a server and a client - it will connect to several clients, 
 * and also several servers (P2P network).
 * 
 * The P2P network is a directed graph with bidirectional communication channels.
 * 
 * TODO investigate event emitter memory leak
 * TODO close reason doesn't work
 * 
 * ##### Events
 * - `listening` (port: string) - when the underlying ws server binds successfully
 * - `connection` (socket, incoming) - low level socket connection
 * 
 * For all other events, use the underlying web socket object.
 */
class WSServer extends EventEmitter {
  constructor({ port, httpServer }) {
    super();
    this.connectionHandler = this.connectionHandler.bind(this);
    
    // map remote socket addresses (ip:port) to sockets
    this.servers = {};
    this.port = port;
    
    // create underlaying server and listen
    this.wss = httpServer ?
      new WebSocket.Server({ server: httpServer }) : 
      new WebSocket.Server({ port });
    // when bound to an network interface
    this.wss.on('listening', () => this.emit('listening', port));
    // when receiving incoming connection
    this.wss.on('connection', (socket, req) => {
      this.connectionHandler(socket, true);
    });
    // when websocket server has error (don't crash it)
    this.wss.on('error', console.log);

    // set up heartbeats
    this.timer = setInterval(this.genHeartbeat(), 60000);
  }

  /**
   * Note that you cannot have more than one socket to a single URL.
   * And also note that error could be thrown if url is invalid.
   * Failure of connection will only cause some logs (won't crash
   * the application).
   * 
   * Right now, there's no way to get notified when it fails to connect
   * (such as because of timeout) except for a log mentioned before.
   * 
   * This should not be used, because this is a server.
   */
  createConnection(url) {
    let socketAddress = null;
    let remoteDaemonPort = null;
    try {
      ({ host: socketAddress, port: remoteDaemonPort } = new URL(url));
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

    socket.on('open', () => {
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
      for (let socket of [...this.wss.clients, ...Object.values(this.servers)]) {
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
    return !socket.alive && socket.readyState === WebSocket.OPEN;
  }

  socketAlive(socket) {
    return socket.readyState === WebSocket.OPEN;
  }

  /**
   * Get some useful information about the network.
   */
  getInfo() {
    let sockets = [];

    for (let socket of this.wss.clients) {
      sockets.push({
        dir: 'inbound',
        ...getSocketInfo(socket)
      });
    }
    for (let socket of Object.values(this.servers)) {
      sockets.push({
        dir: 'outbound',
        ...getSocketInfo(socket)
      });
    }

    return {
      port: this.port,
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
    this.wss.close();
  }
}

module.exports = WSServer;
