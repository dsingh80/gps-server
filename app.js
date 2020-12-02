/**
 * @file app.js
 * @fileOverview
 * Stores the first point of contact server logic
 * This file handles initializing connections, handling uncaught exceptions, and properly shutting the server down
 */
'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  logger = require('morgan'),
  colors = require('colors/safe'),
  session = require('express-session'),
  MongoSessionStore = require('connect-mongodb-session')(session),
  Database = require('./app/classes/Database'),
  http = require('http'),
  path = require('path'),
  util = require('util'),
  fs = require('fs');

/**
 * =====================================================
 * Configure Server
 * =====================================================
 */
const app = express(),
  config = require(path.join(__dirname, 'config/services.js'));
let _services;
if (process.env.NODE_ENV == 'development') _services = config.development;
else _services = config.production;


const sessionStore = new MongoSessionStore(_services.mongodb.Sessions);
sessionStore.on('connected', function() {
  console.assert('Connected to Session store!');
});
sessionStore.on('error', function(err) {
  console.error(err);
});
// Set app constants
app.set('development', _services.server.development);
app.set('port', _services.server.port);


/**
 * =====================================================
 * Logging
 * =====================================================
 */
app.set('trust proxy', true);    // Handles reverse proxy case for logging remote address
const accessLogStream = fs.createWriteStream(path.resolve(_services.server.log_path, 'server.access.log'), { flags: 'a' });
const loggerFormat = '[:date[iso]][:level][:status :status-message] ":method :url" - :remote-addr - :response-time ms';
const loggerOptions = {
  stream: accessLogStream
};
logger.token('level', function getLogLevel(req, res) {
  const status = res && res._header ? res.statusCode : undefined;
  return status >= 400 ? 'ERROR' : 'LOG';
});
logger.token('status-message', function getStatusMessage(req, res) {
  return res && res._header ? res.statusMessage : '';
});
//
// DO NOT CALL THESE LOGGING METHODS DIRECTLY - They are called internally by console.* (See below)
//
const logStream = fs.createWriteStream(path.resolve(_services.server.log_path, 'server.app.log'), { flags: 'a' });
const __writeLog = function(level, color, shouldLog) {
  return function() {
    color = color || 'blue';
    let message = '[' + (new Date).toISOString() + '][' + level + '] ' + util.format.apply(this, arguments) + '\n';
    if (shouldLog) logStream.write(message);
    process.stdout.write(colors[color](message));
  };
};
const __writeError = function(level, color, shouldLog) {
  return function() {
    color = color || 'red';
    let message = '[' + (new Date).toISOString() + '][' + level + '] ' + util.format.apply(this, arguments) + '\n';
    if (shouldLog) logStream.write(message);
    process.stdout.write(colors[color](message));
  };
};
console.log = __writeLog('LOG', 'blue', true);
console.error = __writeError('ERROR', 'red', true);
console.info = __writeLog('INFO', 'green');
console.warn = __writeError('WARNING', 'yellow');
console.assert = __writeLog('ASSERT', 'cyan', true);
console.dir = __writeLog('DIR', 'gray', true);


/**
 * =====================================================
 * Middleware & Security
 * =====================================================
 */
app.use(bodyParser.urlencoded({ extended: false }));    // parse form data and assign to req.body
app.use(bodyParser.json({ limit: '25mb' }));
// app.use(cookieParser({ secret: _services.server.cookie_secret }));
// app.use(csurf({ cookie: true }));   // Create a req.csrfToken() method to generate CSRF tokens
app.use(logger(loggerFormat, loggerOptions));   // handle console logs formatting
app.use(session({
  store: sessionStore,
  secret: _services.server.session_secret,
  resave: false,
  saveUninitialized: true
}));
// TODO: Enable this when SSL is setup on the server
// ------==========   Redirect Insecure Requests to HTTPs   ==========------
// if (!app.get('development')) {
//   app.use(function redirectInsecureRequests(req, res, next) {
//     if (!req.secure && req.get('X-Forwarded-Proto') !== 'https') return res.redirect('https://' + req.get('host') + req.url);
//     next();
//   });
// }
// ------==========   Disables iframe loading, xss reflection attacks, and more   ==========------
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.ieNoOpen());
app.use(helmet.xssFilter());
app.use(helmet.contentSecurityPolicy({
  directives: {
    'frame-ancestors': ['\'none\'']
  }
}));
// ------==========   Disable X-Powered-By   ==========------
app.use(function setPoweredByHeader(req, res, next) {
  app.disable('X-Powered-By');
  res.setHeader('X-Powered-By', '');
  next();
});
// ------==========   Enable CORS   ==========------
app.use(function setAccessControlHeaders(req, res, next) {
  const origin = req.get('origin');
  if (origin) res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', '*');    // origin || '*');
  res.header('Access-Control-Allow-Headers', req.get('access-control-request-headers') || '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') return res.status(200).end();
  next();
});


/**
 * =====================================================
 * Routing Configuration
 * =====================================================
 */
app.use('/ping(.html)?', function(req, res) { res.sendStatus(200); });   // Status check
app.use('/assets', express.static(path.join(__dirname, 'src/')));   // Static assets
app.use(require(path.join(__dirname, 'app/routes/router.js')));   // Register main app routes


/**
 * =====================================================
 * Start Server
 * =====================================================
 */
console.assert('Starting server...');
console.assert('NODE_ENV =', process.env.NODE_ENV);

let db = Database,
  server = http.createServer(app);

startServer(server, db);


// Handle any outstanding events
process.on('message', function(msg) {
  if (msg && msg.cmd == 'shutdown') {
    shutdownServer();
  }
});
process.on('uncaughtException', function(err) {
  console.error('UNCAUGHT EXCEPTION: ', err); // Don't shutdown the server here. This event will fire many times throughout the server's lifetime
});


function startServer(server, db) {
  db.connectAll()
      .then(() => {
        server.listen(app.get('port'), function (err) {
          if (err) return console.error('Server failed to start on port', process.env.PUBLIC_PORT || app.get('port'));
          console.log('Express server started on port', process.env.PUBLIC_PORT || app.get('port'));
        });
      })
      .catch(console.error);
}

/**
 * @function shutdownServer
 * @description Helper method to gracefully shutdown the server and any open connections
 */
function shutdownServer() {
  console.assert('Server shutting down...');
  if (db) {
    try {
      db.disconnectAll()
          .then(() => {
            console.assert('Closed all MongoDB connections');
          });
    }
    catch (err) {
      console.assert('Failed to close MongoDB connections');
      console.error(err);
    }
  }
  if (server) {
    server.close();
    console.assert('Server is down.');
  }
}