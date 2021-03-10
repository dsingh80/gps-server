/**
 * @file client.js
 * @fileOverview
 * Routes relating to the client's account
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router();

const utils = require('../utils'),
  Database = require('../classes/Database');

/**
 * Route Definitions
 */
router.put('/', validateUpdateDemographicInfoInput, updateDemographicInfo);
router.put('/password', validateUpdatePasswordInput, validateCurrentPassword, updatePassword);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */

/**
 *
 *
 * Get Demographic Info
 *
 */
function getDemographicInfo(req, res) {
  let select = {
    email: 1,
    phone: 1,
    firstName: 1,
    lastName: 1
  };
  Database.clients.getClientById(req.session.clientId, select)
    .then((data) => {
      res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS, data));
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    });
}


/**
 *
 *
 * Update Demographic Info
 *
 */
function validateUpdateDemographicInfoInput(req, res, next) {
  let input = req.body;
  let optionalParams = {
    email: 'string',
    phoneNumber: 'string',
    firstName: 'string',
    lastName: 'string',
    _csrf: 'string' // may be passed in some other way (header, cookie, etc)
  };
  if(!utils.typeCheck(input, optionalParams)) {
    res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Invalid inputs')));
    return;
  }

  next();
}

function updateDemographicInfo(req, res) {
  let input = req.body;

  // Be very explicit about which properties (and which values) to update otherwise some unwanted behaviour can occur
  let updates = {};
  if(input.email) { updates.email = input.email; }
  if(input.phoneNumber) { updates.phone = input.phoneNumber; }
  if(input.firstName) { updates.first_name = input.firstName; }
  if(input.lastName) { updates.last_name = input.lastName; }

  Database.clients.updateClientById(req.session.clientId, updates)
    .then((data) => {
      let updatedDoc = {};  // we don't want to the send the entire document down since it may contain sensitive information.
      Object.keys(updates).forEach((key) => updatedDoc[key] = data[key]);
      res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS, null, updatedDoc));
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    });
}


/**
 *
 *
 * Update Password
 *
 */
function validateUpdatePasswordInput(req, res, next) {
  let input = req.body;
  let optionalParams = {
    _csrf: 'string' // may be passed in some other way (header, cookie, etc)
  };
  let requiredParams = {
    currentPassword: 'string',
    newPassword: 'string',
    newPasswordVerify: 'string'
  };
  if(!utils.typeCheck(input, optionalParams) || !utils.typeCheck(input, requiredParams, true)) {
    res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Invalid inputs')));
    return;
  }

  next();
}

function validateCurrentPassword(req, res, next) {
  let input = req.body;
  let select = {
    email: true,
    password: true,
    salt: true
  };
  Database.clients.getClientById(req.session.clientId, select)
    .then((doc) => {
      doc.validatePassword(input.currentPassword)
        .then(() => { next(); })
        .catch((err) => {
          res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
        });
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    });
}

function updatePassword(req, res) {
  let input = req.body;
  Database.clients.updatePassword(req.session.clientId, input.newPassword)
    .then((doc) => {
      res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS));
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    })
}


/**
 *
 * Get Devices
 *
 */
function getDevices(req, res) {
  let filter = {
    client: req.session.clientId
  };
  let options = {
    populate: {
      path: 'subscription'
    }
  };
  Database.devices.listDevices(filter, null, options)
    .then((data) => {
      res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS, null, data));
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err)));
    });
}


/**
 *
 * Get Subscriptions
 *
 */
function getSubscriptions(req, res) {
  Database.subscriptions.getClientSubscriptions(req.session.clientId)
    .then((data) => {
      res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS, null, data));
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err)));
    });
}


module.exports = router;