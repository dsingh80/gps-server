'use strict';

const Collection = require('./Collection'),
  DeviceSchema = require('../schemas/device'),
  utils = require('../utils');

const ApplicationError = utils.ApplicationError,
  ObjectId = require('mongoose').Types.ObjectId;

/**
 * @class DevicesCollection
 * @classdesc
 * Manages the Device schema on MongoDB. This class is used to decouple MongoDB query formatting, handling, etc away from the client.
 * The query handling functionality is stored in the prototype while proxy methods (stored on the class) will handle queuing the queries for processing
 */
class DevicesCollection extends Collection {

  constructor(connection) {
    const requiredParams = {
      connection: 'object'
    };
    if(!utils.typeCheck(arguments, requiredParams, true, false)) {
      throw 'Attempt to initialize a DevicesCollection without a mongoose connection object';
    }
    super();
    this.model = connection.model('Device', DeviceSchema);
  }


  /**
   * @method addDevice
   * @param {String} imei
   * @param {String} iccid
   * @param {String} model
   * @param {String} platform - which platform the client interacts with this device through (Ex. wialon)
   * @param {String} platformId - a way to identify the device on the platform
   * @param {Object=}additionalParams
   * @param {Function=} callback
   * @returns {Promise<Object>} - newly created device
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async addDevice(imei, iccid, model, platform, platformId, additionalParams, callback) {
    const requiredParams = {
      imei: 'string',
      iccid: 'string',
      model: 'string',
      platform: 'string',
      platformId: 'string'
    };
    const optionalParams = {
      additionalParams: 'object',
      callback: 'function'
    };
    return new Promise((resolve, reject) => {
      if(!utils.typeCheck(arguments, requiredParams, true, false) || !utils.typeCheck(arguments, optionalParams)) {
        let err = new ApplicationError('Invalid params');
        if(callback) { callback(err); }
        reject(err);
        return;
      }
      this.request(DevicesCollection.prototype._addDevice, [this, imei, iccid, model, platform, platformId, additionalParams], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getDevice
   * @param {Object} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async getDevice(filter, select, options, callback) {
    const requiredParams = {
      filter: 'object',
    };
    const optionalParams = {
      select: 'object',
      options: 'object',
      callback: 'function'
    };
    return new Promise((resolve, reject) => {
      if(!utils.typeCheck(arguments, requiredParams, true, false) || !utils.typeCheck(arguments, optionalParams)) {
        let err = new ApplicationError('Invalid params');
        if(callback) { callback(err); }
        reject(err);
        return;
      }
      this.request(DevicesCollection.prototype.__findOne, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getActiveDevices
   * @param {Object=} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async getActiveDevices(filter, select, options, callback) {
    const optionalParams = {
      filter: 'object',
      select: 'object',
      options: 'object',
      callback: 'function'
    };
    return new Promise((resolve, reject) => {
      if(!utils.typeCheck(arguments, optionalParams)) {
        let err = new ApplicationError('Invalid params');
        if(callback) { callback(err); }
        reject(err);
        return;
      }
      filter = filter || {};
      filter.status = 'active';
      this.request(DevicesCollection.prototype.__find, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getInactiveDevices
   * @param {Object=} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async getInactiveDevices(filter, select, options, callback) {
    const optionalParams = {
      filter: 'object',
      select: 'object',
      options: 'object',
      callback: 'function'
    };
    return new Promise((resolve, reject) => {
      if(!utils.typeCheck(arguments, optionalParams)) {
        let err = new ApplicationError('Invalid params');
        if(callback) { callback(err); }
        reject(err);
        return;
      }
      filter = filter || {};
      filter.status = {
        '$ne': 'active'
      };
      this.request(DevicesCollection.prototype.__find, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getDevicesPendingActivation
   * @param {Object=} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Array<Object>>}
   * @description
   * Utility function to retrieve inactive devices with a subscription
   * If the filter provided does not have a subscription_id, all devices pending activation will be returned
   */
  async getDevicesPendingActivation(filter, select, options, callback) {
    filter = filter || {};
    filter.subscription_id = {
      '$exists': true
    };
    return this.getInactiveDevices(filter, null, null, callback);
  }

}


/**
 * @method addDevice
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} imei
 * @param {String} iccid
 * @param {String} model
 * @param {String} platform - which platform the client interacts with this device through (Ex. wialon)
 * @param {String} platformId - a way to identify the device on the platform
 * @param {Object=} additionalParams
 * @param {Function=} callback
 * @returns {Promise<Object>} - newly created device
 */
DevicesCollection.prototype._addDevice = async function(self, imei, iccid, model, platform, platformId, additionalParams, callback) {
  let properties = {...additionalParams};
  properties.imei = imei;
  properties.iccid = iccid;
  properties.model = model;
  properties.platform = platform;
  properties.platform_id = platformId;

  let doc = new self.model(properties);
  doc.save()
    .then((obj) => callback(null, obj))
    .catch((err) => callback(err));
}


/**
 * @method __findOne
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
DevicesCollection.prototype.__findOne = async function(self, filter, select, options, callback) {
  select = select || {};
  options = options || {};

  Collection.__findOne(self.model, filter, select, options, callback);
};


/**
 * @method __find
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object=} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
DevicesCollection.prototype.__find = async function(self, filter, select, options, callback) {
  filter = filter || {};
  select = select || {};
  options = options || {};

  Collection.__find(self.model, filter, select, options, callback);
};


module.exports = DevicesCollection;