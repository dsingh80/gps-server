'use strict';

const mongoose = require('mongoose'),
  CollectionFactory = require('./CollectionFactory');

const config = require('../../config/services.js');
let _services;
if (process.env.NODE_ENV === 'development') _services = config['development'];
else _services = config['production'];


/**
 * @class Database
 * @classdesc
 * Database is a SINGLETON
 * Handles connections to the database and forwarding db requests to their appropriate handlers
 */
class Database {

  constructor(dbConfig) {
    this.ClientsCollection = null;
    this.DevicesCollection = null;
    this.SubscriptionsCollection = null;
    this.WialonUsersCollection = null;
    this.StripeCustomersCollection = null;
    this.WooCommerceCustomersCollection = null;
    this.__collectionFactory = new CollectionFactory(dbConfig);
    this.__dbConfig = dbConfig;
  }


  /**
   * @method connectAll
   * @description
   * Tries to open every connection to the database. If any connections fail, an exception with the error will be thrown
   * This method should be called at app launch AND FINISHED before any other functionality relating to the database can be processed.
   * Otherwise, the app may crash with errors relating to undefined database connections
   */
  async connectAll() {
    if (this.ClientsCollection == null) {
      this.ClientsCollection = await this.__collectionFactory.getClientsCollection();
    }
    if (this.DevicesCollection == null) {
      this.DevicesCollection = await this.__collectionFactory.getDevicesCollection();
    }
    if (this.SubscriptionsCollection == null) {
      this.SubscriptionsCollection = await this.__collectionFactory.getSubscriptionsCollection();
    }
    if (this.WialonUsersCollection == null) {
      this.WialonUsersCollection = await this.__collectionFactory.getWialonUsersCollection();
    }
    if (this.StripeCustomersCollection == null) {
      this.StripeCustomersCollection = await this.__collectionFactory.getStripeCustomersCollection();
    }
    if (this.WooCommerceCustomersCollection == null) {
      this.WooCommerceCustomersCollection = await this.__collectionFactory.getWooCommerceCustomersCollection();
    }
    return this;
  }


  /**
   * @method disconnectAll
   * @returns {Promise}
   * @description Disconnect all open MongoDB connections. Nullifies any connections stored in variables
   */
  async disconnectAll() {
    let promise = mongoose.disconnect();
    this.ClientsCollection = null;
    this.DevicesCollection = null;
    this.SubscriptionsCollection = null;
    this.WialonUsersCollection = null;
    this.StripeCustomersCollection = null;
    this.WooCommerceCustomersCollection = null;
    return promise;
  }


  /**
   * @type {ClientsCollection} clients
   */
  get clients() {
    return this.getClientsCollection();
  }


  /**
   * @type {DevicesCollection} devices
   */
  get devices() {
    return this.getDevicesCollection();
  }


  /**
   * @type {SubscriptionsCollection} subscriptions
   */
  get subscriptions() {
    return this.getSubscriptionsCollection();
  }


  /**
   * @type {WialonUsersCollection} wialonUsers
   */
  get wialonUsers() {
    return this.getWialonUsersCollection();
  }


  /**
   * @type {WialonUsersCollection} stripeCustomers
   */
  get stripeCustomers() {
    return this.getStripeCustomersCollection();
  }


  /**
   * @type {WialonUsersCollection} wcCustomers
   */
  get wcCustomers() {
    return this.getWCCustomersCollection();
  }


  /**
   * @method getClientsCollection
   */
  getClientsCollection() {
    return this.ClientsCollection;
  }


  /**
   * @method getDevicesCollection
   */
  getDevicesCollection() {
    return this.DevicesCollection;
  }


  /**
   * @method getSubscriptionsCollection
   */
  getSubscriptionsCollection() {
    return this.SubscriptionsCollection;
  }


  /**
   * @method getWialonUsersCollection
   */
  getWialonUsersCollection() {
    return this.WialonUsersCollection;
  }


  /**
   * @method getStripeCustomersCollection
   */
  getStripeCustomersCollection() {
    return this.StripeCustomersCollection;
  }


  /**
   * @method getWCCustomersCollection
   */
  getWCCustomersCollection() {
    return this.WooCommerceCustomersCollection;
  }

}


module.exports = new Database(_services['mongodb']);