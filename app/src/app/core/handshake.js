const EventEmitter = require('wolfy87-eventemitter');
const Peer = require('./peer');
const { getCurTimestamp } = require('../utils/time');
const { getSocketAddress } = require('../utils/network');
const {
  messageValidators, info, infoAck,
  messageTypes: { info: infoType, infoAck: infoAckType }
} = require('./messages');

// allowed message types during handshake
const MSG_TYPES = [infoType, infoAckType];

class PendingSocket {
  constructor(socket, incoming) {
    // the pending socket itself
    this.socket = socket;

    // inbound or outbound
    this.incoming = incoming;

    // 'INIT'
    // 'INFO_SENT'
    // 'ESTABLISHED'
    this.state = 'INIT';

    // the timestamp when socket is created
    this.timestamp = getCurTimestamp();

    // remote info
    this.uuid = undefined;
    this.nodeType = undefined;
    this.daemonPort = undefined;
  }
}

class HandshakeManager extends EventEmitter {
  constructor(node) {
    super();
    this.socketConnectHandler = this.socketConnectHandler.bind(this);

    // `litenode` is the same as `node`
    this.litenode = node;
    this.uuid = node.uuid;
    this.nodeType = 'client';
    this.daemonPort = undefined;

    // sockets => pending sockets (which is a wrapper)
    this.pendingSockets = new Map();

    // listen on new socket connection
    this.litenode.on('socketconnect', this.socketConnectHandler);

    // in case too many pending connections (such as DDoS),
    // drop pending connections after roughly 20s' idle
    this.timer = setInterval(() => {
      let now = getCurTimestamp();
      for (let [socket, pendingSocket] of this.pendingSockets) {
        if (now - pendingSocket.timestamp > 20000) {
          console.warn(`Handshake timeouts with ${getSocketAddress(socket)}.`);
          socket.close(undefined, 'HANDSHAKE_TIMEOUTS');
          this.pendingSockets.delete(socket);
        }
      }

    }, 10000);
  }

  addPendingSocket(socket, incoming) {
    try {
      let pendingSocket = new PendingSocket(socket, incoming);
      let proxiedSocket = this.litenode.createSocketProxy(socket, 'N/A');

      socket._messageHandler = ((message) => {
        try {
          let { state } = pendingSocket
          let { messageType, ...payload } = JSON.parse(message);
          if (typeof messageType !== 'string' || !MSG_TYPES.includes(messageType)) {
            throw new Error();
          }

          if (this.litenode.debug) {
            // note that only logs valid procotol messages
            this.litenode.messageLogs.push({
              peer: 'N/A',
              dir: 'inbound',
              msg: { messageType, ...payload },
              time: getCurTimestamp('s')
            });
          }
          
          // when receiving info message
          if (messageType === infoType) {
            messageValidators[infoType](payload);
  
            if (incoming && state === 'INIT') {
              pendingSocket.state = 'INFO_SENT'
              pendingSocket.uuid = payload.uuid;
              pendingSocket.nodeType = payload.nodeType;
              pendingSocket.daemonPort = payload.daemonPort;
  
              this.sendInfo(proxiedSocket);
  
            } else if (!incoming && state === 'INFO_SENT') {
              pendingSocket.state = 'ESTABLISHED';
              pendingSocket.uuid = payload.uuid;
              pendingSocket.nodeType = payload.nodeType;
              pendingSocket.daemonPort = payload.daemonPort;
  
              this.sendInfoAck(proxiedSocket);
              this.onEstablished(pendingSocket);
  
            } else {
              throw new Error();
            }
          }
  
          // when receiving info ack message
          if (messageType === infoAckType) {
            messageValidators[infoAckType](payload);
  
            if (incoming && state === 'INFO_SENT') {
              pendingSocket.state = 'ESTABLISHED';
  
              this.onEstablished(pendingSocket);
  
            } else {
              throw new Error();
            }
          }
  
        } catch (err) {
          console.warn(`Handshake failed with ${getSocketAddress(socket)}, reason:\n${err.stack}`);
          // close the underlying socket
          socket.close(undefined, 'HANDSHAKE_FAILED');
        }

      // eslint-disable-next-line
      }).bind(this); // end of _messageHandler

      socket.on('data', socket._messageHandler);
      socket.on('close', (code, reason) => {
        this.pendingSockets.delete(socket);
      });
      this.pendingSockets.set(socket, pendingSocket);

      if (!incoming) {
        // sending the first info message
        // to initiate the handshake process
        this.sendInfo(proxiedSocket);
        pendingSocket.state = 'INFO_SENT'
      }

    } catch (err) {
      console.warn(`Handshake failed with ${getSocketAddress(socket)}, reason:\n${err}`);
      // close the underlying socket
      socket.close(undefined, 'HANDSHAKE_FAILED');
    }
  }

  socketConnectHandler(socket, incoming) {
    this.addPendingSocket(socket, incoming);
  }

  // on handshake completing
  onEstablished(pendingSocket) {
    let { socket, incoming, uuid, nodeType, daemonPort } = pendingSocket;
    let peer = new Peer(uuid, socket, incoming, daemonPort, nodeType);

    socket.removeListener('data', socket._messageHandler);
    delete socket._messageHandler
    
    this.pendingSockets.delete(socket);
    this.litenode.addNewPeer(peer);
  }

  sendInfo(socket) {
    socket.send(JSON.stringify(info({
      uuid: this.uuid, 
      nodeType: this.nodeType,
      daemonPort: this.daemonPort
    })));
  }

  sendInfoAck(socket) {
    socket.send( JSON.stringify(infoAck()) );
  }

  /**
   * Do the cleanup.
   */
  close() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}; // end of HandshakeManager

module.exports = HandshakeManager;
