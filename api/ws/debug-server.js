const http = require('http');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const notfoundPayload = { 'not-found': true };

/**
 * filter log entries
 */
function logFilter(logs, { peer, dir, type, since }) {
  return logs.filter(log => (
    (!peer || log.peer.startsWith(peer))
    && (!dir || log.dir.startsWith(dir))
    && (!type || log.msg.messageType.startsWith(type))
    && (!since || log.time > since)
  ));
}

/**
 * create a very minimalist rest server for debugging
 */
function createDebugServer(syncServer) {
  const app = express();
  const node = syncServer.node;

  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/', (req, res) => {
    res.status(200).json({
      endpoints: [
        { '/info': 'all sorts of info about this node' },
        { '/peers': 'peer information' },
        { '/logs': 'protocol message logs' },
        { '/rooms': 'information of all rooms' },
      ]
    });
  });

  app.get('/info', (req, res) => {
    res.status(200).json(node.getInfo());
  });

  app.get('/peers', (req, res) => {
    let { type } = req.query;
    res.status(200).json(syncServer.peers(type));
  });

  app.get('/logs', (req, res) => {
    let logs = node.messageLogs;
    let { peer, dir, type, since } = req.query;
    if (typeof since === 'string') {
      since = parseInt(since);
    }

    res.status(200).json(logFilter(logs, { peer, dir, type, since }));
  });

  app.get('/rooms', (req, res) => {
    res.status(200).json(Array.from(syncServer.rooms.values()));
  });

  return http.createServer(app);
}

module.exports = createDebugServer;
