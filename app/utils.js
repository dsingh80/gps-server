/**
 * @file utils.js
 * @fileOverview Utility functions for miscellaneous uses
 */
'use strict';

const MongoErrors = require('../config/mongo_errors.json');

/**
 * @function getMongoError
 * @param {Object} err - error object returned by MongoDB
 * @returns {String}
 */
module.exports.getMongoError = function(err) {
  return MongoErrors[err.code] || err.message;
};


/**
 * @function requireUncached
 * @param module  Path to the module RELATIVE TO THIS FILE
 * @returns {NodeModule}
 * @description
 * Cache busting utility function for modules
 * Module paths should always be relative to the location of the utils.js file
 */
module.exports.requireUncached = function(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
};


/**
 * @function typeCheck
 * @param {Object} obj
 * @param {Object} types - key-value pairing of the given object's properties to their relative types (returned by typeof)
 * @param {Boolean} requireNotNull - if any value is null, this will return false
 * @param {Boolean} strictObjectFormat - if any key in the types object is not defined in obj, this will return false
 * @returns {Boolean}
 * @description Validate data types for properties of an object
 */
module.exports.typeCheck = function(obj, types, requireNotNull=false, strictObjectFormat=false) {
  if(!obj || !types) { return false; }
  if(typeof obj !== 'object') { return false; }
  if(typeof types !== 'object') { return false; }

  let keys = Object.keys(obj);
  if(!keys.length) {  // Empty object received (the loop will never run)
    let numTypes = Object.keys(types).length;
    if(!numTypes) { return true; }
    return !requireNotNull && !strictObjectFormat;  // this object is valid if we don't require any strict type checking
  }
  for (let key of keys) {
    // If we don't recognize this key
    if (!types[key]) {
      if(strictObjectFormat) { return false; } // only keys defined in types will be allowed
      continue; // otherwise, we allow it and skip to the next key
    }
    // Make sure every key has a value
    if(obj[key] == null && requireNotNull) { return false; }
    if(typeof types[key] == 'object') {
      if(!module.exports.typeCheck(obj[key], types[key])) {  // Recursively type-check nested objects
        return false;
      }
    }
    else if (typeof obj[key] !== types[key].toLowerCase()) {
      return false;
    }
  }
  return true;
};


/**
 * @function buildPayload
 * @param {RequestStatus|RequestStatus} status
 * @param {String=} errorMessage
 * @param {Object=} data
 * @returns {Object}
 * @description
 * Used to build payloads to send to client
 * This function exists because we want to guarantee that every payload is sent with a consistent format
 */
module.exports.buildPayload = function(status, errorMessage, data) {
  if(!status && !errorMessage && !data) {
    throw 'Attempt to build response payload without any parameters';
  }
  let payload = {
    status: status
  };
  if(errorMessage) {
    payload.errorMessage = errorMessage;
  }
  if(data) {
    payload.data = data;
  }
  return payload;
}


/**
 * @enum {RequestStatus}
 */
module.exports.RequestStatus = {
  FAIL: 'failure',
  SUCCESS: 'success'
};


/**
 * @typedef  {Object} ApplicationError
 * @property  {String} message
 * @property  {Object=} additionalParams
 * @description Used for any internal errors to maintain a consistent error interface
 */
module.exports.ApplicationError = function(message, additionalParams={}) {
  if(!message) { throw 'Attempt to initialize ApplicationError without an error message'; }
  this.message = message;
  Object.keys(additionalParams).forEach((key) => this[key] = additionalParams[key]);
}