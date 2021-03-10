'use strict';

const mongoose = require('mongoose');

const ClientsCollection = require('./ClientsCollection'),
  DevicesCollection = require('./DevicesCollection'),
  SubscriptionsCollection = require('./SubscriptionsCollection'),
  WialonUsersCollection = require('./WialonUsersCollection');


/**
 * @class CollectionFactory
 * @classdesc
 * Handles generating Collection objects
 * Flyweights are used for the collections to improve performance
 */
class CollectionFactory {

  constructor(dbConfig) {
    this.__connections = {};
    this.__collections = {};
    this.__connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    };
    this.__dbConfig = dbConfig;
  }


  /**
   * @method getClientsCollection
   * @returns {Promise<ClientsCollection>}
   */
  async getClientsCollection() {
    return new Promise((resolve, reject) => {
      if(this.__collections.Clients) {
        resolve(this.__collections.Clients);
      }
      mongoose.createConnection(this.__dbConfig.Clients.uri, this.__connectOptions)
        .then((connection) => {
          this.__connections.Clients = connection;
          this.__collections.Clients = new ClientsCollection(connection);
          resolve(this.__collections.Clients);
          console.info('Connected to ClientsCollection!');
        })
        .catch((err) => {
          console.info('Failed to connect to ClientsCollection!');
          console.error(err);
          reject();
        })
    });
  }


  /**
   * @method getDevicesCollection
   * @returns {Promise<DevicesCollection>}
   */
  async getDevicesCollection() {
    return new Promise((resolve, reject) => {
      if(this.__collections.Devices) {
        resolve(this.__collections.Devices);
      }
      mongoose.createConnection(this.__dbConfig.Devices.uri, this.__connectOptions)
        .then((connection) => {
          this.__connections.Devices = connection;
          this.__collections.Devices = new DevicesCollection(connection);
          resolve(this.__collections.Devices);
          console.info('Connected to DevicesCollection!');
        })
        .catch((err) => {
          console.info('Failed to connect to DevicesCollection!');
          console.error(err);
          reject();
        })
    });
  }


  /**
   * @method getSubscriptionsCollection
   * @returns {Promise<SubscriptionsCollection>}
   */
  async getSubscriptionsCollection() {
    return new Promise((resolve, reject) => {
      if(this.__collections.Subscriptions) {
        resolve(this.__collections.Subscriptions);
      }
      mongoose.createConnection(this.__dbConfig.Subscriptions.uri, this.__connectOptions)
        .then((connection) => {
          this.__connections.Subscriptions = connection;
          this.__collections.Subscriptions = new SubscriptionsCollection(connection);
          resolve(this.__collections.Subscriptions);
          console.info('Connected to SubscriptionsCollection!');
        })
        .catch((err) => {
          console.info('Failed to connect to SubscriptionsCollection!');
          console.error(err);
          reject();
        })
    });
  }


  /**
   * @method getWialonUsersCollection
   * @returns {Promise<WialonUsersCollection>}
   */
  async getWialonUsersCollection() {
    return new Promise((resolve, reject) => {
      if(this.__collections.WialonUsers) {
        resolve(this.__collections.WialonUsers);
      }
      mongoose.createConnection(this.__dbConfig.WialonUsers.uri, this.__connectOptions)
        .then((connection) => {
          this.__connections.WialonUsers = connection;
          this.__collections.WialonUsers = new WialonUsersCollection(connection);
          resolve(this.__collections.WialonUsers);
          console.info('Connected to WialonUsersCollection!');
        })
        .catch((err) => {
          console.info('Failed to connect to WialonUsersCollection!');
          console.error(err);
          reject();
        })
    });
  }


  /**
   * @method getStripeCustomersCollection
   * @returns {Promise<StripeCustomersCollection>}
   */
  async getStripeCustomersCollection() {
    return new Promise((resolve, reject) => {
      if(this.__collections.StripeCustomers) {
        resolve(this.__collections.StripeCustomers);
      }
      mongoose.createConnection(this.__dbConfig.StripeCustomers.uri, this.__connectOptions)
        .then((connection) => {
          this.__connections.StripeCustomers = connection;
          this.__collections.StripeCustomers = new StripeCustomersCollection(connection);
          resolve(this.__collections.StripeCustomers);
          console.info('Connected to StripeCustomersCollection!');
        })
        .catch((err) => {
          console.info('Failed to connect to StripeCustomersCollection!');
          console.error(err);
          reject();
        })
    });
  }


  /**
   * @method getWooCommerceCustomersCollection
   * @returns {Promise<WooCommerceCustomersCollection>}
   */
  async getWooCommerceCustomersCollection() {
    return new Promise((resolve, reject) => {
      if(this.__collections.WooCommerceCustomers) {
        resolve(this.__collections.WooCommerceCustomers);
      }
      mongoose.createConnection(this.__dbConfig.WooCommerceCustomers.uri, this.__connectOptions)
        .then((connection) => {
          this.__connections.WooCommerceCustomers = connection;
          this.__collections.WooCommerceCustomers = new WooCommerceCustomersCollection(connection);
          resolve(this.__collections.WooCommerceCustomers);
          console.info('Connected to WooCommerceCustomersCollection!');
        })
        .catch((err) => {
          console.info('Failed to connect to WooCommerceCustomersCollection!');
          console.error(err);
          reject();
        })
    });
  }

}


module.exports = CollectionFactory;