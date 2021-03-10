/**
 * @file subscription.js
 * @fileOverview
 * Routes for managing subscriptions
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router();

const utils = require('../utils'),
  Database = require('../classes/Database');

/**
 * Route Definitions
 */
router.post('/', validateActivateDeviceInput, utils.verifySubscriptionOwnership, activateDevice, activateSubscription)
router.delete('/', validateCancelSubscriptionInput, utils.verifySubscriptionOwnershipById, cancelSubscription, deactivateDevice)
router.put('/autopay', validateUpdatePaymentMethodInput, utils.verifySubscriptionOwnership, updatePaymentMethod);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */


/**
 *
 * Activate Device/Subscription
 *
 */
function validateActivateDeviceInput(req, res, next) {
  let input = req.body;
  let requiredParams = {
    subscriptionId: 'string',
    imei: 'string'
  };
  let optionalParams = {
    _csrf: 'string' // may be passed in some other way (header, cookie, etc)
  };
  if(!utils.typeCheck(input, requiredParams, true, false) || !utils.typeCheck(input, optionalParams)) {
    res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Invalid inputs')));
    return;
  }

  next();
}

function activateDevice(req, res, next) {
  let input = req.body;
  let filter = {
    imei: input.imei
  };
  Database.devices.activateDevice(res.locals.subscription._id, req.session.clientId, filter)
    .then(() => {
      next();
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    });
}

function activateSubscription(req, res) {
  let filter = {
    _id: res.locals.subscription._id,
    client: req.session.clientId
  };
  Database.subscriptions.activateSubscription(filter)
    .then((data) => {
      res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS, null, data));
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    });
}


/**
 *
 * Cancel Subscription
 *
 */
function validateCancelSubscriptionInput(req, res, next) {
  let input = req.body;
  let requiredParams = {
    subscriptionId: 'string'
  };
  let optionalParams = {
    _csrf: 'string' // may be passed in some other way (header, cookie, etc)
  };
  if(!utils.typeCheck(input, requiredParams, true, false) || !utils.typeCheck(input, optionalParams)) {
    res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Invalid inputs')));
    return;
  }

  next();
}

function cancelSubscription(req, res, next) {
  let input = req.body;
  let subscription = res.locals.subscription;
  /**
   *
   * TODO: Cancel subscription on whichever platform it exists on
   *       Subscription should be removed from client's account via webhook update automatically
   *
   */
  let filter = {
    _id: subscription._id
  };
  Database.subscriptions.deactivateSubscription(filter)
    .then(() => {})
    .catch(console.error)
    .finally(() => {
      next();
    })
}

function deactivateDevice(req, res) {
  let input = req.body;
  Database.devices.deactivateDevice(input.subscriptionId, req.session.clientId)
    .then((data) => {
      res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS, null, data));
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    });
}


/**
 *
 * Update Payment Method
 *
 */
function validateUpdatePaymentMethodInput(req, res, next) {
  let input = req.body;
  let requiredParams = {
    subscriptionId: 'string',
    paymentToken: 'string',
    platform: 'string',
    platformId: 'string'
  };
  let optionalParams = {
    _csrf: 'string' // may be passed in some other way (header, cookie, etc)
  };
  if(!utils.typeCheck(input, requiredParams, true, true) || !utils.typeCheck(input, optionalParams)) {
    res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Invalid inputs')));
    return;
  }

  next();
}

function updatePaymentMethod(req, res) {
  res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS, 'Updated payment method for subscription'));
}




module.exports = router;