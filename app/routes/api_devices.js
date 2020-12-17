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
router.use(sanitizeInput);
router.post('/status', getDeviceStatus);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */
function sanitizeInput(req, res, next) {
  next();
}


function getDeviceStatus(req, res) {
  let payload, promise;
  let input = req.body;
  if(!input || !input.imei && !input.iccid) {
    payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Invalid Request');
    res.status(400).send(payload);
    return;
  }

  let filter = {};
  if(input.imei) {
    filter.imei = input.imei;
  }
  if(input.iccid) {
    filter.iccid = input.iccid;
  }

  promise = Database.devices.getDevice(filter)
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, { status: data.status });
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Failed to retrieve device status');
      res.status(200).send(payload);
    })
}


module.exports = router;