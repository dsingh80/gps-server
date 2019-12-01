'use strict';

const MongoDB = require('mongoose'),
  UsersCollection = require('./UsersCollection');

const config = require('../../config/services.js');
let _services = null;
if (process.env.NODE_ENV == 'development') _services = config.development;
else _services = config.production;


/**
 * @class Database
 * @classdesc
 * Database is a SINGLETON
 * Handles connections to the database and forwarding db requests to their appropriate handlers
 */
class Database {

  constructor(dbServices) {
    this.__UsersCollection = null;

    this.__connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    this.__dbServices = dbServices;
  }


  /**
   * @method connectAll
   * @description
   * Tries to open every connection to the database. If any connections fail, an exception with the error will be thrown
   * This method should be called at app launch AND FINISHED before any other functionality relating to the database can be processed.
   * Otherwise, the app may crash with errors relating to undefined database connections
   */
  async connectAll() {
    try {
      if (this.__UsersCollection == null) {
        await this.__connect(this.__dbServices.Users.uri);
        this.__UsersCollection = new UsersCollection();
        console.info('Connected to UsersCollection!');
      }
    }
    catch (err) {
      this.__UsersCollection = null;
      throw err;
    }
    return this;
  }


  /**
   * @method __connect
   * @param uri - MongoDB URI used to connect to the database with authentication
   * @returns {Promise}
   * @description
   * Connect to a MongoDB instance.
   * This is internal-use-only because we want the Database to make all connections once at initialization.
   * No one else should be calling this method or they'd break encapsulation and have access to MongoDB <Connection> directly
   */
  async __connect(uri) {
    return MongoDB.connect(uri, this.__connectOptions);
  }


  /**
   * @method disconnectAll
   * @returns {Promise}
   * @description Disconnect all open MongoDB connections. Nullifies any connections stored in variables
   */
  async disconnectAll() {
    let promise = MongoDB.disconnect();
    this.__UsersCollection = null;
    return promise;
  }


  /**
   * @method users
   * @description Alias for getUsersCollection
   */
  users() {
    return this.getUsersCollection();
  }


  /**
   * @method getUsersCollection
   * @description Returns the UsersCollection object that manages the User schema
   */
  getUsersCollection() {
    return this.__UsersCollection;
  }

}


module.exports = new Database(_services.mongodb);