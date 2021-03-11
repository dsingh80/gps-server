'use strict';

const utils = require('../utils'),
  url = require('url'),
  path = require('path');

const ApplicationError = utils.ApplicationError;

//
// Services Config
//
const servicesConfig = utils.requireUncached(path.join(__dirname, '../..', 'config/services'));
let _services,
  http;
if (process.env.NODE_ENV == 'development') {
  _services = servicesConfig.development;
  http = require('https');
}
else {
  _services = servicesConfig.production;
  http = require('https');
}

const config = _services.pod,
  THREE_MINUTES = 1000 * 60 * 3;

/**
 * @class PodGroupAPI
 * @classdesc
 * Interacts with PodGroup's REST API
 * https://api.podiotsuite.com/v3/docs/swagger/index.html
 */
class PodGroupAPI {
  constructor() {
    this.__accessToken = null;
    this.__accessTokenCreatedAt = 0;
    this.__getAccessToken()
      .then(() => {})
      .catch(() => {});
  }

  async __getAccessToken() {
    if(this.__accessToken && new Date() - this.__accessTokenCreatedAt < THREE_MINUTES) { return this.__accessToken; }
    this.__accessToken = null;
    let reqUrl = new URL(config.host + 'auth/token');
    let payload = {
      username: config.username,
      password: config.password
    };
    let options = {
      method: 'POST',
      protocol: reqUrl.protocol,
      host: reqUrl.hostname,
      port: reqUrl.port,
      path: reqUrl.pathname + reqUrl.search
    };

    return new Promise((resolve, reject) => {
      let req = http.request(options);

      req.on('error', (err) => {
        reject(err);
        req.destroy();  // destroy the request so no further calls to callback are made
      });

      req.on('response', (res) => {
        let data = '';
        // Receiving data from response
        res.on('data', (d) => {
          data += d;
        })
        // All data received
        res.on('end', () => {
          if(res.statusCode >= 400) { // Request returned an error
            reject("Failed to retrieve access token from PodGroup API. Status Code: " + res.statusCode);
            return;
          }
          data = JSON.parse(data);
          this.__accessToken = data.token;
          this.__accessTokenCreatedAt = new Date();
          resolve(this.__accessToken);
        });
      });

      req.write(JSON.stringify(payload));
      req.end();
    });
  }

}


/**
 * @method __sendRequest
 * @param {Object} self - instance of class
 * @param {String} method - network request method (GET, POST, PUT, etc.)
 * @param {String} endpoint - api endpoint to hit. DO NOT PREFIX WITH A '/'
 * @param {Object=} data - data to send to api
 * @param {Object=} customHeaders - additional headers to add to the request
 * @param {Function=} callback
 * @return {Object} - {status, errorCode, errorMessage, response}
 * @description
 * Utility function used to send API requests while hiding request logic
 */
PodGroupAPI.prototype.__sendRequest = async function(self, method, endpoint, data, customHeaders, callback) {
  if(!endpoint) { throw 'No endpoint provided'; }
  if(!method) { method = 'GET'; }

  let reqUrl = new URL(config.host + endpoint);
  let req = await PodGroupAPI.prototype.__buildRequest(self, customHeaders)
  req.method = method;
  req.protocol = reqUrl.protocol;
  req.host = reqUrl.hostname;
  req.port = reqUrl.port;
  req.path = reqUrl.pathname + reqUrl.search;

  req.on('error', (err) => {
    if(callback) { callback(err); }
    req.destroy();  // destroy the request so no further calls to callback are made
  });

  req.on('response', (res) => {
    let data = '';
    // Receiving data from response
    res.on('data', (d) => {
      data += d;
    })
    // All data received
    res.on('end', () => {
      if(res.statusCode >= 400) { // Request returned an error
        callback(res.statusMessage, JSON.parse(data));
        return;
      }
      callback(null, JSON.parse(data))
    });
  });

  req.write(JSON.stringify(data));
  req.end();
}


/**
 * @method __buildRequest
 * @param {Object} self - instance of class
 * @param {Object=} customHeaders - custom headers in a key-value format to attach to the request
 * @return {http.ClientRequest} - formatted request that still needs to be sent
 */
PodGroupAPI.prototype.__buildRequest = async function(self, customHeaders) {
  let headers = {...customHeaders};
  headers['Content-Type'] = 'application/json';
  headers['Accept'] = 'application/json';
  headers['x-access-token'] = await self.__getAccessToken();

  let options = {
    headers: headers
  };

  return http.request(options);
}



module.exports = PodGroupAPI;