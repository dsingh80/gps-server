'use strict';

const Collection = require('./Collection'),
  DeviceSchema = require('../schemas/device'),
  SubscriptionSchema = require('../schemas/subscription'),
  ClientSchema = require('../schemas/client'),
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
    connection.model('Subscription', SubscriptionSchema)
    connection.model('Client', ClientSchema)
    this.model = connection.model('Device', DeviceSchema);
  }


  /**
   * @method addDevice
   * @param {String} imei
   * @param {String} iccid
   * @param {String} model
   * @param {String} imageUrl
   * @param {Object=} additionalParams
   * @param {Function=} callback
   * @returns {Promise<Object>} - newly created document
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async addDevice(imei, iccid, model, imageUrl, additionalParams, callback) {
    const requiredParams = {
      imei: 'string',
      iccid: 'string',
      model: 'string',
      imageUrl: 'string',
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
      this.request(DevicesCollection.prototype._addDevice, [this, imei, iccid, model, imageUrl, additionalParams], function(err, data) {
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
   * @method listDevices
   * @param {Object} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async listDevices(filter, select, options, callback) {
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
      this.request(DevicesCollection.prototype.__find, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method activateDevice
   * @param {String} subscriptionId
   * @param {String} clientId
   * @param {Object} filter
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async activateDevice(subscriptionId, clientId, filter, options, callback) {
    const requiredParams = {
      subscriptionId: 'string',
      clientId: 'string',
      filter: 'object'
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
      this.request(DevicesCollection.prototype._activateDevice, [this, subscriptionId, clientId, filter, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method deactivateDevice
   * @param {String} subscriptionId
   * @param {String} clientId
   * @param {Object=} filter
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async deactivateDevice(subscriptionId, clientId, filter, options, callback) {
    const requiredParams = {
      subscriptionId: 'string',
      clientId: 'string'
    };
    const optionalParams = {
      filter: 'object',
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
      this.request(DevicesCollection.prototype._deactivateDevice, [this, subscriptionId, clientId, filter, options], function(err, data) {
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
      filter.subscription = {
        $exists: true
      };
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
      filter.subscription = {
        $exists: false
      };
      this.request(DevicesCollection.prototype.__find, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }

}


/**
 * @method _addDevice
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} imei
 * @param {String} iccid
 * @param {String} model
 * @param {String} imageUrl
 * @param {Object=} additionalParams
 * @param {Function=} callback
 * @returns {Promise<Object>} - newly created document
 */
DevicesCollection.prototype._addDevice = async function(self, imei, iccid, model, imageUrl, additionalParams, callback) {
  let properties = {...additionalParams};
  properties.imei = imei;
  properties.iccid = iccid;
  properties.model = model;
  properties.image_url = imageUrl;

  let doc = new self.model(properties);
  doc.save()
    .then((obj) => callback(null, obj))
    .catch((err) => callback(err));
}


/**
 * @method _activateDevice
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} subscriptionId
 * @param {String} clientId
 * @param {Object} filter
 * @param {Object=} options
 * @param {Function} callback
 * @returns {Promise<Object>} - newly created document
 */
DevicesCollection.prototype._activateDevice = async function(self, subscriptionId, clientId, filter, options={}, callback) {
  let updates = {
    subscription: subscriptionId,
    client: clientId
  };
  self.getDevice(filter, { subscription: 1, client: 1 })
    .then((doc) => {
      if(doc.subscription) {
        if(callback) { callback(new ApplicationError('Device already has a subscription. Please make sure the device is inactive')); }
        return;
      }
      DevicesCollection.prototype.__updateOne(self, filter, updates, options, callback);
    })
    .catch((err) => {
      if(callback) { callback(new ApplicationError('Failed to find device. Are you sure your search criteria is correct?')); }
    });
}


/**
 * @method _deactivateDevice
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} subscriptionId
 * @param {String} clientId
 * @param {Object} filter
 * @param {Object=} options
 * @param {Function} callback
 * @returns {Promise<Object>} - newly created document
 */
DevicesCollection.prototype._deactivateDevice = async function(self, subscriptionId, clientId, filter, options={}, callback) {
  filter = filter || {};
  filter.subscription = subscriptionId;
  filter.client = clientId;
  let updates = {
    subscription: null,
    client: null
  };

  return DevicesCollection.prototype.__updateOne(self, filter, updates, options, callback);
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
  select = select || {
    _id: 1,
    subscription: 1,
    client: 1,
    imei: 1,
    nickname: 1,
    model: 1,
    image_url: 1,
    error_code: 1,
    error_message: 1,
    num_network_checks: 1};
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
  select = select || {
    _id: 1,
    subscription: 1,
    client: 1,
    imei: 1,
    nickname: 1,
    model: 1,
    image_url: 1,
    error_code: 1,
    error_message: 1,
    num_network_checks: 1
  };
  options = options || {};

  Collection.__find(self.model, filter, select, options, callback);
};


/**
 * @method __updateOne
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object=} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
DevicesCollection.prototype.__updateOne = async function(self, filter, updates, options, callback) {
  filter = filter || {};
  updates = updates || {};
  options = options || {};

  Collection.__updateOne(self.model, filter, updates, options, callback);
};


module.exports = DevicesCollection;