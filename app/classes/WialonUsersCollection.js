'use strict';

const Collection = require('./Collection'),
  WialonUserSchema = require('../schemas/wialon_user'),
  utils = require('../utils');

const ApplicationError = utils.ApplicationError,
  ObjectId = require('mongoose').Types.ObjectId;


/**
 * @class WialonUsersCollection
 * @classdesc
 * Manages the WialonUser schema on MongoDB. This class is used to decouple MongoDB query formatting, handling, etc away from the wialon_user.
 * The query handling functionality is stored in the prototype while proxy methods (stored on the class) will handle queuing the queries for processing
 */
class WialonUsersCollection extends Collection {

  constructor(connection) {
    const requiredParams = {
      connection: 'object'
    };
    if(!utils.typeCheck(arguments, requiredParams, true, false)) {
      throw 'Attempt to initialize a WialonUsersCollection without a mongoose connection object';
    }
    super();
    this.model = connection.model('WialonUser', WialonUserSchema);
  }


  /**
   * @method addWialonUser
   * @param {String} client_id
   * @param {String} wialon_user_id
   * @param {String} wialon_account_id
   * @param {Object=}additionalParams
   * @param {Function=} callback
   * @returns {Promise<Object>} - newly created device
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async addWialonUser(client_id, wialon_user_id, wialon_account_id, additionalParams, callback) {
    const requiredParams = {
      client_id: 'string',
      wialon_user_id: 'string',
      wialon_account_id: 'string'
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
      this.request(WialonUsersCollection.prototype._addWialonUser, [this, client_id, wialon_user_id, wialon_account_id, additionalParams], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getWialonUserById
   * @param {String} id
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getWialonUserById(id, select, options, callback) {
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
      this.request(WialonUsersCollection.prototype._getWialonUserById, [this, id, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getWialonUser
   * @param {Object} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getWialonUser(filter, select, options, callback) {
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
      this.request(WialonUsersCollection.prototype._getWialonUser, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method updateWialonUser
   * @param {String} id
   * @param {Object} updates
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async updateWialonUser(id, updates, options, callback) {
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
      this.request(WialonUsersCollection.prototype._updateWialonUser, [this, filter, updates, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }

}


/**
 * @method _addWialonUser
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String | ObjectId} client_id
 * @param {String} wialon_user_id
 * @param {String} wialon_account_id
 * @param {Object=} additionalParams
 * @param {Function=} callback
 * @returns {Promise<Object>} - newly created wialon_user
 */
WialonUsersCollection.prototype._addWialonUser = async function(self, client_id, wialon_user_id, wialon_account_id, additionalParams, callback) {
  let properties = {...additionalParams};
  properties.client_id = client_id;
  properties.wialon_user_id = wialon_user_id;
  properties.wialon_account_id = wialon_account_id;

  let doc = new self.model(properties);
  doc.save()
    .then((obj) => callback(null, obj))
    .catch((err) => callback(err));
}


/**
 * @protected
 * @method _getWialonUserById
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} id
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
WialonUsersCollection.prototype._getWialonUserById = async function(self, id, select, options, callback) {
  select = select || {};
  options = options || {};

  self.__findById(self, id, select, options, callback);
};


/**
 * @protected
 * @method _getWialonUser
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
WialonUsersCollection.prototype._getWialonUser = async function(self, filter, select, options, callback) {
  select = select || {};
  options = options || {};

  self.__findOne(self, filter, select, options, callback);
};


/**
 * @protected
 * @method _listWialonUsers
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object=} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
WialonUsersCollection.prototype._listWialonUsers = async function(self, filter, select, options, callback) {
  filter = filter || {};
  select = select || {};
  options = options || {};

  self.__find(self, filter, select, options, callback);
};


/**
 * @protected
 * @method _updateWialonUser
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
WialonUsersCollection.prototype._updateWialonUser = async function(self, filter, updates, options, callback) {
  options = options || {};

  self.__updateOne(self, filter, updates, options, callback);
};


/**
 * @protected
 * @method _upsertWialonUser
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
WialonUsersCollection.prototype._upsertWialonUser = async function(self, filter, updates, options, callback) {
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
WialonUsersCollection.prototype.__findById = async function(self, id, select, options, callback) {
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
WialonUsersCollection.prototype.__findOne = async function(self, filter, select, options, callback) {
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
WialonUsersCollection.prototype.__find = async function(self, filter, select, options, callback) {
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
WialonUsersCollection.prototype.__updateOne = async function(self, filter, updates, options, callback) {
  options = options || {};
  Collection.__updateOne(self.model, filter, updates, options, callback);
};


module.exports = WialonUsersCollection;