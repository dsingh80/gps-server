'use strict';

const Collection = require('./Collection'),
  Database = require('./Database'),
  SubscriptionSchema = require('../schemas/subscription'),
  ClientSchema = require('../schemas/client'),
  utils = require('../utils');

const ApplicationError = utils.ApplicationError,
  ObjectId = require('mongoose').Types.ObjectId;


/**
 * @class SubscriptionsCollection
 * @classdesc
 * Manages the Subscription schema on MongoDB. This class is used to decouple MongoDB query formatting, handling, etc away from the subscription.
 * The query handling functionality is stored in the prototype while proxy methods (stored on the class) will handle queuing the queries for processing
 */
class SubscriptionsCollection extends Collection {

  constructor(connection) {
    const requiredParams = {
      connection: 'object'
    };
    if(!utils.typeCheck(arguments, requiredParams, true, false)) {
      throw 'Attempt to initialize a SubscriptionsCollection without a mongoose connection object';
    }
    super();
    connection.model('Client', ClientSchema);
    this.model = connection.model('Subscription', SubscriptionSchema);
  }


  /**
   * @method addSubscription
   * @param {String} clientId
   * @param {String} platform
   * @param {String} platformId
   * @param {String} name
   * @param {Number} price
   * @param {Number} chargeIntervalFrequency
   * @param {String} chargeIntervalUnit - "day", "month", etc.
   * @param {Object=}additionalParams
   * @param {Function=} callback
   * @returns {Promise<Object>} - newly created document
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async addSubscription(clientId, platform, platformId, name, price, chargeIntervalFrequency, chargeIntervalUnit, additionalParams, callback) {
    const requiredParams = {
      clientId: 'string',
      platform: 'string',
      platformId: 'string',
      name: 'string',
      price: 'number',
      chargeIntervalFrequency: 'number',
      chargeIntervalUnit: 'string'
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
      this.request(SubscriptionsCollection.prototype._addSubscription, [this, clientId, platform, platformId, name, price, chargeIntervalFrequency, chargeIntervalUnit, additionalParams], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getSubscriptionById
   * @param {String} id
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getSubscriptionById(id, select, options, callback) {
    const requiredParams = {
      id: 'string'
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
      this.request(SubscriptionsCollection.prototype._getSubscriptionById, [this, id, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getSubscription
   * @param {Object} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getSubscription(filter, select, options, callback) {
    const requiredParams = {
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
      this.request(SubscriptionsCollection.prototype._getSubscription, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getSubscriptionsForClient
   * @param {String} clientId
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getClientSubscriptions(clientId, select, options, callback) {
    const requiredParams = {
      clientId: 'string'
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
      let filter = {
        client: clientId
      };
      this.request(SubscriptionsCollection.prototype._listSubscriptions, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method updateSubscriptionById
   * @param {String} id
   * @param {Object} updates
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async updateSubscriptionById(id, updates, options, callback) {
    const requiredParams = {
      id: 'string',
      updates: 'object'
    };
    const optionalParams = {
      options: 'object',
      callback: 'function'
    };
    let filter = {
      '_id': id
    };
    return this.updateSubscription(filter, updates, options, callback);
  }


  /**
   * @method updateSubscription
   * @param {Object} filter
   * @param {Object} updates
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async updateSubscription(filter, updates, options, callback) {
    const requiredParams = {
      filter: 'object',
      updates: 'object'
    };
    const optionalParams = {
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
      this.request(SubscriptionsCollection.prototype._updateSubscription, [this, filter, updates, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method upsertSubscription
   * @param {String} id
   * @param {Object} updates
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async upsertSubscription(id, updates, options, callback) {
    const requiredParams = {
      id: 'string',
      updates: 'object'
    };
    const optionalParams = {
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
      let filter = {
        '_id': ObjectId(id)
      };
      this.request(SubscriptionsCollection.prototype._upsertSubscription, [this, filter, updates, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method activateSubscription
   * @param {Object} filter
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async activateSubscription(filter, callback) {
    let updates = {
      'activated': true
    };
    return this.updateSubscription(filter, updates, null, callback);
  }


  /**
   * @method deactivateSubscription
   * @param {Object} filter
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async deactivateSubscription(filter, callback) {
    let updates = {
      'activated': false
    };
    return this.updateSubscription(filter, updates, null, callback);
  }


  /**
   * @method getSubscriptionsPendingActivation
   * @param {String} clientId
   * @param {Object=} options
   * @param {Object=} select
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async getSubscriptionsPendingActivation(clientId, select, options, callback) {
    const requiredParams = {
      clientId: 'string'
    };
    const optionalParams = {
      select: 'object',
      options: 'object'
    };

    return new Promise((resolve, reject) => {
      if(!utils.typeCheck(arguments, requiredParams, true, false) || !utils.typeCheck(arguments, optionalParams)) {
        let err = new ApplicationError('Invalid params');
        if(callback) { callback(err); }
        reject(err);
        return;
      }
      let filter = {
        client: clientId,
        activated: false
      };
      this.request(SubscriptionsCollection.prototype._listSubscriptions, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getActiveSubscriptions
   * @param {String} clientId
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   */
  async getActiveSubscriptions(clientId, select, options, callback) {
    const requiredParams = {
      clientId: 'string'
    };
    const optionalParams = {
      select: 'object',
      options: 'object'
    };

    return new Promise((resolve, reject) => {
      if(!utils.typeCheck(arguments, requiredParams, true, false) || !utils.typeCheck(arguments, optionalParams)) {
        let err = new ApplicationError('Invalid params');
        if(callback) { callback(err); }
        reject(err);
        return;
      }
      let filter = {
        client: clientId,
        activated: true
      };
      this.request(SubscriptionsCollection.prototype._listSubscriptions, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }

}


/**
 * @method _addSubscription
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String | ObjectId} clientId
 * @param {String} platform
 * @param {String} platformId
 * @param {String} name
 * @param {Number} price
 * @param {Number} chargeIntervalFrequency
 * @param {String} chargeIntervalUnit - "day", "month", etc.
 * @param {Object=} additionalParams
 * @param {Function=} callback
 * @returns {Promise<Object>} - newly created document
 */
SubscriptionsCollection.prototype._addSubscription = async function(self, clientId, platform, platformId, name, price, chargeIntervalFrequency, chargeIntervalUnit, additionalParams, callback) {
  let properties = {...additionalParams};
  properties.client = clientId;
  properties.platform = platform;
  properties.platform_id = platformId;
  properties.name = name;
  properties.price = price;
  properties.charge_interval_frequency = chargeIntervalFrequency;
  properties.charge_interval_unit = chargeIntervalUnit;

  let doc = new self.model(properties);
  doc.save()
    .then((obj) => callback(null, obj))
    .catch((err) => callback(err));
}


/**
 * @protected
 * @method _getSubscriptionById
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} id
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
SubscriptionsCollection.prototype._getSubscriptionById = async function(self, id, select, options, callback) {
  select = select || {};
  options = options || {};

  self.__findById(self, id, select, options, callback);
};


/**
 * @protected
 * @method _getSubscription
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
SubscriptionsCollection.prototype._getSubscription = async function(self, filter, select, options, callback) {
  select = select || {};
  options = options || {};

  self.__findOne(self, filter, select, options, callback);
};


/**
 * @protected
 * @method _listSubscriptions
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object=} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
SubscriptionsCollection.prototype._listSubscriptions = async function(self, filter, select, options, callback) {
  filter = filter || {};
  select = select || {};
  options = options || {};

  self.__find(self, filter, select, options, callback);
};


/**
 * @protected
 * @method _updateSubscription
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
SubscriptionsCollection.prototype._updateSubscription = async function(self, filter, updates, options, callback) {
  options = options || {};

  self.__updateOne(self, filter, updates, options, callback);
};


/**
 * @protected
 * @method _upsertSubscription
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
SubscriptionsCollection.prototype._upsertSubscription = async function(self, filter, updates, options, callback) {
  options = options || {};
  options.upsert = true;

  self.__updateOne(self, filter, updates, options, callback);
};


/**
 * @protected
 * @method __findById
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} id
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
SubscriptionsCollection.prototype.__findById = async function(self, id, select, options, callback) {
  select = select || {};
  options = options || {};
  Collection.__findById(self.model, id, select, options, callback);
};


/**
 * @protected
 * @method __findOne
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
SubscriptionsCollection.prototype.__findOne = async function(self, filter, select, options, callback) {
  select = select || {};
  options = options || {};
  Collection.__findOne(self.model, filter, select, options, callback);
};


/**
 * @protected
 * @method __find
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
SubscriptionsCollection.prototype.__find = async function(self, filter, select, options, callback) {
  filter = filter || {};
  select = select || {};
  options = options || {};
  Collection.__find(self.model, filter, select, options, callback);
};


/**
 * @protected
 * @method __updateOne
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
SubscriptionsCollection.prototype.__updateOne = async function(self, filter, updates, options, callback) {
  options = options || {};
  Collection.__updateOne(self.model, filter, updates, options, callback);
};


module.exports = SubscriptionsCollection;