'use strict';

const Queue = require('./Queue'),
  QueueMember = require('./QueueMember'),
  utils = require('../utils');

const ApplicationError = utils.ApplicationError,
  ObjectId = require('mongoose').Types.ObjectId;

/**
 * @class Collection
 * @classdesc
 * Abstract class for a collection in MongoDB. This class should NEVER be instantiated directly.
 * Handles the logic for queuing requests to the Collection
 */
class Collection {

  constructor() {
    this.requestQueue = new Queue();
  }


  /**
   * @method request
   * @param {Function} method - PROTOTYPE METHOD of the instantiated collection. This is what will be run (Ex. UserCollection.getAllUsers)
   * @param {Array} params - parameters to pass to the method being called. This is typically going to be an array with a single query object
   * @param {Function} callback - function(err, data)
   * @description Queues a task to be run on a database. This design is used to handle race conditions on the database using a FIFO queue
   */
  request(method, params, callback) {
    let options = {
      method: method,
      params: params,
      callback: callback
    };
    this.requestQueue.push(new QueueMember(options));
  }


  /**
   * @method __findById
   * @param {Object} model - a mongoose Model object to query against
   * @param {String} id
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function} callback - function/method to call when finished; function(err, data);
   */
  static __findById(model, id, select, options, callback) {
    select = select || {};
    options = options || {};

    model.findById(ObjectId(id), select, options)
      .exec((err, data) => {
        if (callback) {
          if (err) { return callback(err); }
          else if (!data) { return callback(new ApplicationError('Query returned no results')); }
          return callback(null, data);
        }
      });
  };


  /**
   * @method __findOne
   * @param {Object} model - a mongoose Model object to query against
   * @param {Object} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function} callback - function/method to call when finished; function(err, data);
   */
  static __findOne(model, filter, select, options, callback) {
    if(Object.keys(filter).length <= 0)  {
      return callback(new ApplicationError('Invalid params'));
    }
    select = select || {};
    options = options || {};

    model.findOne(filter, select, options)
      .exec((err, data) => {
        if (callback) {
          if (err) { return callback(err); }
          else if (!data) { return callback(new ApplicationError('Query returned no results')); }
          return callback(null, data);
        }
      });
  };


  /**
   * @method __find
   * @param {Object} model - a mongoose Model object to query against
   * @param {Object=} filter
   * @param {Object=} select
   * @param {Object=} options
   * @param {Function} callback - function/method to call when finished; function(err, data);
   */
  static __find(model, filter, select, options, callback) {
    filter = filter || {};
    select = select || {};
    options = options || {};
    options.select = select;

    model.paginate(filter, options)
      .then((data) => {
        callback(null, data);
      })
      .catch((err) => {
        callback(err);
      });
  };


  /**
   * @method __updateOne
   * @param {Object} model - a mongoose Model object to query against
   * @param {Object=} filter
   * @param {Object=} updates
   * @param {Object=} options
   * @param {Function} callback - function/method to call when finished; function(err, data);
   */
  static __updateOne(model, filter, updates, options, callback) {
    filter = filter || {};
    options = options || {};
    options.new = options.new == null ? true : options.new;  // return the modified document by default

    model.findOneAndUpdate(filter, updates, options)
      .then((data) => {
        callback(null, data);
      })
      .catch((err) => {
        callback(err);
      });
  };

}


module.exports = Collection;