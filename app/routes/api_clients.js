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
router.post('/', checkCreateClientInput, createClient);
router.get('/:client_id?', getClient);
router.put('/:client_id', checkUpdateClientInput, updateClient);
router.get('/:client_id/subscriptions', getClientSubscriptions);


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
function checkCreateClientInput(req, res, next) {
  let payload;
  let input = req.body;
  let requiredParams = {
    'email': 'string'
  };
  let optionalParams = {
    'phone': 'string',
    'first_name': 'string',
    'last_name': 'string'
  };
  if(!utils.typeCheck(input, requiredParams, true, false ) || !utils.typeCheck(input, optionalParams)) {
    payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Invalid Request');
    res.status(400).send(payload);
    return;
  }
  next();
}

//
// createClient
//
function createClient(req, res) {
  let payload;
  let input = req.body;

  let promise;
  let clientData = {
    'phone': input['phone'],
    'first_name': input['first_name'],
    'last_name': input['last_name']
  };
  promise = Database.clients.addClient(input.email, clientData);
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, { id: data._id, email: data.email });
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err));
      res.status(200).send(payload);
    });
}

//
// getClient
//
function getClient(req, res) {
  let payload, promise;
  let requiredParams = {
    'client_id': 'string'
  };
  let optionalParams = {
    'email': 'string'
  }
  if(!utils.typeCheck(req.params, requiredParams, true, true)) {    // Check if client id was provided
    if(!utils.typeCheck(req.query, optionalParams, true, true)) {   // Otherwise fallback to the email
      payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Invalid Request');
      res.status(400).send(payload);
      return;
    }
    else {
      let email = req.query.email;
      promise = Database.clients.getClientByEmail(email);
    }
  }
  else {
    let clientId = req.params.client_id;
    promise = Database.clients.getClient(clientId);
  }

  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null, data);
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Failed to retrieve data');
      res.status(200).send(payload);
    });
}

//
// checkUpdateClientInput
//
function checkUpdateClientInput(req, res, next) {
  let payload;
  let input = req.body;
  let requiredParams = {
    'client_id': 'string'
  };
  let optionalParams = {
    'email': 'string',
    'phone': 'string',
    'first_name': 'string',
    'last_name': 'string'
  };
  if(!utils.typeCheck(req.params, requiredParams, true) || !utils.typeCheck(input, optionalParams)) {
    payload = utils.buildPayload(utils.RequestStatus.FAIL, 'Invalid Request');
    res.status(400).send(payload);
    return;
  }
  next();
}

//
// updateClient
//
function updateClient(req, res) {
  let payload;
  let input = req.body;

  let promise;
  let clientData = {
    'email': input['email'],
    'phone': input['phone'],
    'first_name': input['first_name'],
    'last_name': input['last_name']
  };
  promise = Database.clients.updateClient(req.params.client_id, clientData);
  promise
    .then((data) => {
      payload = utils.buildPayload(utils.RequestStatus.SUCCESS, null);
      res.status(200).send(payload);
    })
    .catch((err) => {
      payload = utils.buildPayload(utils.RequestStatus.FAIL, utils.getMongoError(err));
      res.status(200).send(payload);
    });
}

//
// getClientSubscriptions
//
function getClientSubscriptions(req, res) {
  let payload, promise;
  promise = Database.subscriptions.getClientSubscriptions(req.params.client_id);
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