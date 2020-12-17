'use strict';

const Collection = require('./Collection'),
  StripeCustomerSchema = require('../schemas/stripe_customer'),
  utils = require('../utils');

const ApplicationError = utils.ApplicationError,
  ObjectId = require('mongoose').Types.ObjectId;


/**
 * @class StripeCustomersCollection
 * @classdesc
 * Manages the StripeCustomer schema on MongoDB. This class is used to decouple MongoDB query formatting, handling, etc away from the stripe_customer.
 * The query handling functionality is stored in the prototype while proxy methods (stored on the class) will handle queuing the queries for processing
 */
class StripeCustomersCollection extends Collection {

  constructor(connection) {
    const requiredParams = {
      connection: 'object'
    };
    if(!utils.typeCheck(arguments, requiredParams, true, false)) {
      throw 'Attempt to initialize a StripeCustomersCollection without a mongoose connection object';
    }
    super();
    this.model = connection.model('StripeCustomer', StripeCustomerSchema);
  }


  /**
   * @method addStripeCustomer
   * @param {String} client_id
   * @param {String} stripe_customer_id
   * @param {Object=}additionalParams
   * @param {Function=} callback
   * @returns {Promise<Object>} - newly created device
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async addStripeCustomer(client_id, stripe_customer_id, additionalParams, callback) {
    const requiredParams = {
      client_id: 'string',
      stripe_customer_id: 'string',
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
      this.request(StripeCustomersCollection.prototype._addStripeCustomer, [this, client_id, stripe_customer_id, additionalParams], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getStripeCustomerById
   * @param {String} id - this is the MongoDB internal id, not the stripe customer id
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getStripeCustomerById(id, select, options, callback) {
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
      this.request(StripeCustomersCollection.prototype._getStripeCustomerById, [this, id, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getStripeCustomer
   * @param {Object} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getStripeCustomer(filter, select, options, callback) {
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
      this.request(StripeCustomersCollection.prototype._getStripeCustomer, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method updateStripeCustomer
   * @param {String} id
   * @param {Object} updates
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async updateStripeCustomer(id, updates, options, callback) {
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
      this.request(StripeCustomersCollection.prototype._updateStripeCustomer, [this, filter, updates, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }

}


/**
 * @method _addStripeCustomer
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String | ObjectId} client_id
 * @param {String} stripe_customer_id
 * @param {Object=} additionalParams
 * @param {Function=} callback
 * @returns {Promise<Object>} - newly created stripe_customer
 */
StripeCustomersCollection.prototype._addStripeCustomer = async function(self, client_id, stripe_customer_id, additionalParams, callback) {
  let properties = {...additionalParams};
  properties.client_id = client_id;
  properties.stripe_customer_id = stripe_customer_id;

  let doc = new self.model(properties);
  doc.save()
    .then((obj) => callback(null, obj))
    .catch((err) => callback(err));
}


/**
 * @protected
 * @method _getStripeCustomerById
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} id
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
StripeCustomersCollection.prototype._getStripeCustomerById = async function(self, id, select, options, callback) {
  select = select || {};
  options = options || {};

  self.__findById(self, id, select, options, callback);
};


/**
 * @protected
 * @method _getStripeCustomer
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
StripeCustomersCollection.prototype._getStripeCustomer = async function(self, filter, select, options, callback) {
  select = select || {};
  options = options || {};

  self.__findOne(self, filter, select, options, callback);
};


/**
 * @protected
 * @method _listStripeCustomers
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object=} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
StripeCustomersCollection.prototype._listStripeCustomers = async function(self, filter, select, options, callback) {
  filter = filter || {};
  select = select || {};
  options = options || {};

  self.__find(self, filter, select, options, callback);
};


/**
 * @protected
 * @method _updateStripeCustomer
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
StripeCustomersCollection.prototype._updateStripeCustomer = async function(self, filter, updates, options, callback) {
  options = options || {};

  self.__updateOne(self, filter, updates, options, callback);
};


/**
 * @protected
 * @method _upsertStripeCustomer
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
StripeCustomersCollection.prototype._upsertStripeCustomer = async function(self, filter, updates, options, callback) {
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
StripeCustomersCollection.prototype.__findById = async function(self, id, select, options, callback) {
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
StripeCustomersCollection.prototype.__findOne = async function(self, filter, select, options, callback) {
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
StripeCustomersCollection.prototype.__find = async function(self, filter, select, options, callback) {
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
StripeCustomersCollection.prototype.__updateOne = async function(self, filter, updates, options, callback) {
  options = options || {};
  Collection.__updateOne(self.model, filter, updates, options, callback);
};


module.exports = StripeCustomersCollection;