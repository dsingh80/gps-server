/**
 * @file device.js
 * @fileOverview
 * Routes for managing devices
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router();

const utils = require('../utils'),
  Database = require('../classes/Database');

/**
 * Route Definitions
 */
router.put('/', validateUpdateDeviceInput, utils.verifySubscriptionOwnership, updateDevice);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */


/**
 *
 * Update Device
 *
 */
function validateUpdateDeviceInput(req, res, next) {
  next();
}

function updateDevice(req, res) {
  res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS));
}


module.exports = router;