const extractSocketAddr = (url) => {
  let result = /^ws:\/\/(.+):(\d+)\/?/.exec(url);
  if (result) {
    return {
      host: result[1],
      port: parseInt(result[2], 10)
    };
  }
  throw new Error('Unable to extract socket address from url.');
};

const getRemoteAddress = (socket) => {
  if (typeof window.self === 'object') {
    return extractSocketAddr(socket.url).host;
  }
  return socket._socket.remoteAddress.replace(/^.*:/, '');
};

/**
 * Note that a string will be returned.
 */
const getRemotePort = (socket) => {
  if (typeof window.self === 'object') {
    return extractSocketAddr(socket.url).port + '';
  }
  return socket._socket.remotePort + '';
};

/**
 * Of remote end.
 * 
 * @param {*} socket 
 */
const getSocketAddress = (socket) => {
  return `${getRemoteAddress(socket)}:${getRemotePort(socket)}`;
};

const getLocalAddress = (socket) => 
  typeof window.self === 'object' ?
    undefined :
    socket._socket.localAddress.replace(/^.*:/, '');

const getLocalPort = (socket) => 
  typeof window.self === 'object' ?
    undefined :
    socket._socket.localPort;

const getLocalSocketAddr = (socket) =>
  `${getLocalAddress(socket)}:${getLocalPort(socket)}`;

const getSocketInfo = (socket) => ({
  localSocketAddr: getLocalSocketAddr(socket),
  remoteSocketAddr: getSocketAddress(socket)
});

const getReadyState = (socket) => 
  typeof window.self === 'object' ?
    socket._ws.readyState :
    socket.readyState;

exports.getRemoteAddress = getRemoteAddress;
exports.getRemotePort = getRemotePort;
exports.getSocketAddress = getSocketAddress;
exports.getLocalAddress = getLocalAddress;
exports.getLocalPort = getLocalPort;
exports.getLocalSocketAddr = getLocalSocketAddr;
exports.getSocketInfo = getSocketInfo;
exports.getReadyState = getReadyState;
