'use strict';

const Queue = require('./Queue'),
  QueueMember = require('./QueueMember');

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

}


module.exports = Collection;