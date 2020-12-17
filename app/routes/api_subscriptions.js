/**
 * @file api_clients.js
 * @fileOverview
 * Stored alongside all of the other routing files
 */
'use strict';

const router = require('express').Router();

const Database = require('../classes/Database'),
    utils = require('../utils.js');


/**
 * Route Definitions
 */
router.get('/active', getActiveSubscriptions);
router.get('/inactive', getInactiveSubscriptions);
router.get('/pending', getPendingSubscriptions);
router.get('/:subscription_id', getSubscription);
router.put('/:subscription_id/activate', activateSubscription);
router.put('/:subscription_id/deactivate', deactivateSubscription);
router.post('/:subscription_id?', checkCreateSubscriptionInput, createSubscription);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */

//
// checkCreateClientInput
//
function checkCreateSubscriptionInput(req, res, next) {
  let payload;
  let input = req.body;
  let requiredParams = {
    'client_id': 'string',
    'platform': 'string',
    'platform_id': 'string'
  };
  let optionalParams = {
    'status': 'string'
  };
  if(!utils.typeCheck(input, requiredParams, true, false ) || !utils.typeCheck(input, optionalParams)) {
    payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Invalid Request');
    res.status(400).send(payload);
    return;
  }
  next();
}

//
// createSubscription
//
function createSubscription(req, res) {
  let payload, promise;
  let input = req.body;
  let additionalParams = {
    status: input['status']
  };

  promise = Database.subscriptions.addSubscription(input['client_id'], input['platform'], input['platform_id'], additionalParams);
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, { id: data._id, client_id: data.client_id });
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err));
      res.status(200).send(payload);
    });
}

//
// getSubscription
//
function getSubscription(req, res) {
  let payload, promise;
  let requiredParams = {
    'subscription_id': 'string'
  };
  if(!utils.typeCheck(req.params, requiredParams, true, true)) {
    payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Invalid Request');
    res.status(400).send(payload);
    return;
  }

  let subscriptionId = req.params.subscription_id;
  promise = Database.subscriptions.getSubscriptionById(subscriptionId);
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, data);
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err));
      res.status(200).send(payload);
    });
}

//
// activateSubscription
//
function activateSubscription(req, res) {
  let payload, promise;
  let requiredParams = {
    'subscription_id': 'string'
  };
  if(!utils.typeCheck(req.params, requiredParams, true, true)) {
    payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Invalid Request');
    res.status(400).send(payload);
    return;
  }

  let subscriptionId = req.params.subscription_id;
  promise = Database.subscriptions.activateSubscription(subscriptionId);
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, data);
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err));
      res.status(200).send(payload);
    });
}

//
// deactivateSubscription
//
function deactivateSubscription(req, res) {
  let payload, promise;
  let requiredParams = {
    'subscription_id': 'string'
  };
  if(!utils.typeCheck(req.params, requiredParams, true, true)) {
    payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Invalid Request');
    res.status(400).send(payload);
    return;
  }

  let subscriptionId = req.params.subscription_id;
  promise = Database.subscriptions.deactivateSubscription(subscriptionId);
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, data);
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err));
      res.status(200).send(payload);
    });
}

//
// getActiveSubscriptions
//
function getActiveSubscriptions(req, res) {
  let payload, promise;
  promise = Database.subscriptions.getActiveSubscriptions();
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, data);
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err));
      res.status(200).send(payload);
    });
}

//
// getInactiveSubscriptions
//
function getInactiveSubscriptions(req, res) {
  let payload, promise;
  promise = Database.subscriptions.getInactiveSubscriptions();
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, data);
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err));
      res.status(200).send(payload);
    });
}

//
// getPendingSubscriptions
//
function getPendingSubscriptions(req, res) {
  let payload, promise;
  promise = Database.subscriptions.getSubscriptionsPendingActivation();
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, data);
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err));
      res.status(200).send(payload);
    });
}

module.exports = router;