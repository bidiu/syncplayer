const { getRemoteAddress, getSocketAddress } = require('../utils/network');
const { getCurTimestamp } = require('../utils/time');
const { mapToObj } = require('../utils/common');

/**
 * Peer is basically just the client. An application instance
 * (typically a tab in a browser) is a peer.
 */
class Peer {
  /**
   * @param {string} uuid             peer's uuid
   * @param {*} socket                network socket to the peer
   * @param {boolean} incoming        whether the connection is incoming
   * @param {string} daemonPort       (optional) peer's daemon port
   * @param {string} nodeType         (optional) peer's node type, reserved for future use
   */
  constructor(uuid, socket, incoming, { daemonPort, nodeType } = {}) {
    this.uuid = uuid;
    this.socket = socket;
    this.incoming = incoming;
    this.daemonPort = daemonPort;
    this.nodeType = nodeType;
    this.url = `ws://${getRemoteAddress(socket)}:${daemonPort}`;
    this.joinAt = getCurTimestamp();
    this.properties = new Map();
  }

  /**
   * Note that error might be thrown, such as when trying to 
   * send data through closed connection (very rare though - the
   * underlaying litenode will take care of that).
   * 
   * @param {string} message to send
   */
  send(msg) {
    this.socket.send(msg);
  }

  /**
   * Note that error might be thrown, such as when trying to 
   * send data through closed connection (very rare though - the
   * underlaying litenode will take care of that).
   * 
   * @param {Object} jsonObj object to send
   */
  sendJson(jsonObj) {
    this.send(JSON.stringify(jsonObj));
  }

  setProperty(name, value) {
    this.properties.set(name, value);
  }

  mergeProperty(name, value) {
    this.properties.set(name, { ...(this.getProperty(name)), ...value });
  }

  getProperty(name) {
    return this.properties.get(name);
  }

  deleteProperty(name) {
    this.properties.delete(name);
  }

  clearProperties() {
    this.properties.clear();
  }

  toString() {
    return `peer: ${this.url}`;
  }

  toJSON() {
    return {
      uuid: this.uuid,
      remoteAddr: getSocketAddress(this.socket),
      incoming: this.incoming,
      joinAt: this.joinAt,
      daemonPort: this.daemonPort || 'N/A',
      type: this.nodeType || 'N/A',
      properties: mapToObj(this.properties)
    };
  }
}

module.exports = Peer;
