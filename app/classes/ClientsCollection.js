'use strict';

const Collection = require('./Collection'),
  ClientSchema = require('../schemas/client'),
  utils = require('../utils'),
  path = require('path');

const ApplicationError = utils.ApplicationError,
  ObjectId = require('mongoose').Types.ObjectId,
  servicesConfig = utils.requireUncached(path.join(__dirname, '../..', 'config/services'));

let _services;
if (process.env.NODE_ENV == 'development') {
  _services = servicesConfig.development;
}
else _services = servicesConfig.production;

const FIVE_MINUTES = 1000 * 60 * 5;


/**
 * @class ClientsCollection
 * @classdesc
 * Manages the Client schema on MongoDB. This class is used to decouple MongoDB query formatting, handling, etc away from the client.
 * The query handling functionality is stored in the prototype while proxy methods (stored on the class) will handle queuing the queries for processing
 */
class ClientsCollection extends Collection {

  constructor(connection) {
    const requiredParams = {
      connection: 'object'
    };
    if(!utils.typeCheck(arguments, requiredParams, true, false)) {
      throw 'Attempt to initialize a ClientsCollection without a mongoose connection object';
    }
    super();
    this.model = connection.model('Client', ClientSchema);
  }


  /**
   * @method addClient
   * @param {String} email
   * @param {Object=} additionalParams
   * @param {Function=} callback
   * @returns {Promise<Object>} - newly created document
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async addClient(email, additionalParams, callback) {
    const requiredParams = {
      email: 'string'
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
      this.request(ClientsCollection.prototype._addClient, [this, email, additionalParams], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getClient
   * @param {Object} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getClient(filter, select, options, callback) {
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
      this.request(ClientsCollection.prototype._getClient, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getClientById
   * @param {String} id
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getClientById(id, select, options, callback) {
    const requiredParams = {
      id: 'string',
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
      this.request(ClientsCollection.prototype._getClientById, [this, id, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method getClientByEmail
   * @param {String} email
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async getClientByEmail(email, select, options, callback) {
    const requiredParams = {
      email: 'string'
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
        'email': email
      };
      this.request(ClientsCollection.prototype._getClient, [this, filter, select, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method authenticate
   * @param {String} email
   * @param {String} password
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async authenticate(email, password, callback) {
    const requiredParams = {
      email: 'string',
      password: 'string'
    };
    const optionalParams = {
      callback: 'function'
    };
    return new Promise((resolve, reject) => {
      if(!utils.typeCheck(arguments, requiredParams, true, false) || !utils.typeCheck(arguments, optionalParams)) {
        let err = new ApplicationError('Invalid params');
        if(callback) { callback(err); }
        reject(err);
        return;
      }
      this.request(ClientsCollection.prototype._authenticate, [this, email, password], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method updateClient
   * @param {Object} filter
   * @param {Object} updates
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async updateClient(filter, updates, options, callback) {
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
      this.request(ClientsCollection.prototype._updateClient, [this, filter, updates, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method updateClientById
   * @param {String} id
   * @param {Object} updates
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async updateClientById(id, updates, options, callback) {
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
        '_id': id
      };
      this.request(ClientsCollection.prototype._updateClient, [this, filter, updates, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method upsertClient
   * @param {String} id
   * @param {Object} updates
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async upsertClient(id, updates, options, callback) {
    const requiredParams = {
      id: 'string',
      updates: 'string'
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
        '_id': id
      };
      this.request(ClientsCollection.prototype._upsertClient, [this, filter, updates, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }


  /**
   * @method upsertClientByEmail
   * @param {String} email
   * @param {Object} updates
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async upsertClientByEmail(email, updates, options, callback) {
    const requiredParams = {
      email: 'string'
    };
    const optionalParams = {
      updates: 'object',
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
        'email': email
      };
      this.request(ClientsCollection.prototype._upsertClient, [this, filter, updates, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }




  /**
   * @method updatePassword
   * @param {String} id
   * @param {String} newPassword
   * @param {Object=} options
   * @param {Function=} callback
   * @returns {Promise<Object>}
   * @description Proxy for the related internal function. This method adds the request to a Queue instead of running right away
   */
  async updatePassword(id, newPassword, options, callback) {
    const requiredParams = {
      id: 'string',
      newPassword: 'string'
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
        '_id': id
      };
      this.request(ClientsCollection.prototype._updatePassword, [this, filter, newPassword, options], function(err, data) {
        if(callback) { callback(err, data); }
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }

}


/**
 * @method addClient
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} email
 * @param {Object=} additionalParams
 * @param {Function=} callback
 * @returns {Promise<Object>} - newly created document
 */
ClientsCollection.prototype._addClient = async function(self, email, additionalParams, callback) {
  let properties = {...additionalParams};
  properties.email = email;

  let password;
  if(properties.password) {
    password = properties.password;
    delete properties.password;
  }

  let promise;
  let doc = new self.model(properties);
  if(password) {
    promise = doc.setPassword(password)
  }
  else {
    promise = doc.save();
  }

  promise
    .then((obj) => callback(null, obj))
    .catch((err) => callback(err));
}


/**
 * @protected
 * @method _updatePassword
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {String} newPassword
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
ClientsCollection.prototype._updatePassword = async function(self, filter, newPassword, options, callback) {
  filter = filter || {};
  let select = {
    email: true,
    password: true,
    salt: true
  };
  options = options || {};

  self.__findOne(self, filter, select, options, function(err, doc) {
    if(err) { return callback(err); }
    doc.setPassword(newPassword)
      .then((doc) => callback(null, doc))
      .catch((err) => callback(err));
  });
};


/**
 * @protected
 * @method _getClientById
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} id
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
ClientsCollection.prototype._getClientById = async function(self, id, select, options, callback) {
  select = select || {};
  options = options || {};

  self.__findById(self, id, select, options, callback);
};


/**
 * @protected
 * @method _getClient
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object=} select
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
ClientsCollection.prototype._getClient = async function(self, filter, select, options, callback) {
  filter = filter || {};
  select = select || {};
  options = options || {};

  self.__findOne(self, filter, select, options, callback);
};


/**
 * @protected
 * @method _authenticate
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {String} email
 * @param {String} password
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
ClientsCollection.prototype._authenticate = async function(self, email, password, callback) {
  let select = {
    salt: 1,
    password: 1,
    failed_login_attempts: 1,
    last_logged_in: 1,
    last_login_attempt: 1,
    locked_until: 1
  };

  self.getClientByEmail(email, select)
    .then((doc) => {
      if(doc.locked_until && new Date(doc.locked_until) > new Date()) {  // account is locked. cannot login
        if(callback) { callback(new ApplicationError('Account temporarily locked. Please try again later')); }
        return;
      }

      doc.last_login_attempt = new Date();
      doc.validatePassword(password)
        .then(() => {
          doc.last_logged_in = new Date();
          doc.failed_login_attempts = 0;
          doc.locked_until = null;
          if(callback) { callback(null, doc); }
        })
        .catch(() => {
          if(callback) { callback(new ApplicationError('Invalid login credentials')); }
          incrementFailedLogins(doc, false);
        })
        .finally(() => {
          doc.save().then(()=>{}).catch((err)=>console.error(err));
        });

    })
    .catch(() => {
      if(callback) { callback(new ApplicationError('Invalid login credentials')); }
    });
};


/**
 * @protected
 * @method _updateClient
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
ClientsCollection.prototype._updateClient = async function(self, filter, updates, options, callback) {
  options = options || {};

  self.__updateOne(self, filter, updates, options, callback);
};


/**
 * @protected
 * @method _upsertClient
 * @param {Object} self - instantiated object of this class (included as a parameter because 'this' can be undefined for prototypes)
 * @param {Object} filter
 * @param {Object} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
ClientsCollection.prototype._upsertClient = async function(self, filter, updates, options, callback) {
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
ClientsCollection.prototype.__findById = async function(self, id, select, options, callback) {
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
ClientsCollection.prototype.__findOne = async function(self, filter, select, options, callback) {
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
ClientsCollection.prototype.__find = async function(self, filter, select, options, callback) {
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
 * @param {Object=} updates
 * @param {Object=} options
 * @param {Function} callback - function/method to call when finished; function(err, data);
 */
ClientsCollection.prototype.__updateOne = async function(self, filter, updates, options, callback) {
  options = options || {};
  if(updates.password) {
    delete updates.password;  // use ClientModel.setPassword to update this property.
  }
  Collection.__updateOne(self.model, filter, updates, options, callback);
};


/**
 * =========================================================================================
 * Various miscellaneous functions
 * This section is just for code that would clutter the main functionality of the code above
 * =========================================================================================
 */

/**
 * @function incrementFailedLogins
 * @param {Object} doc - mongodb document to modify
 * @param {Boolean=true} shouldSave
 */
function incrementFailedLogins(doc, shouldSave=true) {
  doc.failed_login_attempts += 1;
  if(doc.failed_login_attempts >= _services.server.MAX_LOGIN_ATTEMPTS) {
    doc.failed_login_attempts = _services.server.MAX_LOGIN_ATTEMPTS;
    doc.locked_until = new Date(Date.now() + FIVE_MINUTES);
  }

  if(shouldSave) {
    doc.save().then(()=>{}).catch((err)=>console.error(err));
  }
}



module.exports = ClientsCollection;