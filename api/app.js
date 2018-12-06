require('./models/models');
require('./db/mongo');

const http = require('http');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const notFoundHandler = require('./middleware/errors/not-found');
const validationErrorHandler = require('./middleware/errors/validation-errors');
const mongoErrorHandler = require('./middleware/errors/mongo-errors');
const apiErrorHandler = require('./middleware/errors/api-errors');
const errorHandler = require('./middleware/errors/errors');
const apiV1 = require('./routes/api-v1');
const env = require('./env/env');
const SyncServer = require('./ws/sync-server');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3010',
  // passing cookies, auth headers
  credentials: true
}

// global middleware
app.use(logger('dev'));
if (env.env === 'dev') { app.use(cors(corsOptions)); }
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: env.secret, cookie: { maxAge: env.maxAge } }));

// api v1 route
app.use('/api/v1', apiV1);

// error handlers
app.use(notFoundHandler);
app.use(validationErrorHandler);
app.use(mongoErrorHandler);
app.use(apiErrorHandler);
app.use(errorHandler);

// create the deamon http server
const httpServer = http.createServer(app);
// create the websocket server
new SyncServer({ httpServer, debug: true });
// bind on interface
httpServer.listen(4010);
