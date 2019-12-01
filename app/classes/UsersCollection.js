'use strict';

const Collection = require('./Collection'),
  User = require('../schemas/user');

/**
 * @class UsersCollection
 * @classdesc
 * Manages the User schema on MongoDB. This class is used to decouple MongoDB query formatting, handling, etc away from the client.
 * Any queries to the Users collection must go through the UsersCollection.
 * The query handling functionality is stored in the prototype while proxy methods (stored on the class) will handle queuing the queries for processing
 */
class UsersCollection extends Collection {

  constructor() {
    super();
  }


  /**
   * @method authenticate
   * @param {String} username - username for account being authenticated
   * @param {String} password - password for the account being authenticated
   * @param {Function} callback - function/method to call when finished; function(err, data);
   * @description Proxy for __authenticate. This method adds the request to a Queue instead of running right away
   */
  async authenticate(username, password, callback) {
    this.request(UsersCollection.prototype.__authenticate, [this, username, password], callback);
  }

}


/**
 * @param {Object} self - instantiated object of this class (exists because 'this' can be undefined for prototypes)
 * @param {String} username - username for account being authenticated
 * @param {String} password - password for the account being authenticated
 * @param {Function} callback - function/method to call when finished; function(err, data);
 * @description Validates the user info and returns the document if user is found
 */
UsersCollection.prototype.__authenticate = async function(self, username, password, callback) {
  let query = {
    user: username,
    pwd: password
  };
  let select = {};
  let options = {};

  User.findOne(query, select, options)
    .exec((err, data) => {
      if (callback) {
        if (err) { return callback(err); }
        else if (!data) { return callback('Query returned no results'); }
        return callback(null, data);
      }
    });
};


module.exports = UsersCollection;