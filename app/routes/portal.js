/**
 * @file portal.js
 * @fileOverview
 * Routes relating to any frontend views
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router();

const utils = require('../utils'),
  Database = require('../classes/Database');

/**
 * Route Definitions
 */
router.use(verifySession);
router.get('/logout', cleanUpSession, redirectToLogin);
router.get('/profile', bootstrapClient, renderProfile);
router.get('/device/:deviceId', validateManageDeviceInput, verifyDeviceOwnership, renderManageDevice);
router.get('/', bootstrapSubscriptionsPendingActivation, bootstrapDevices, renderHome);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */
function verifySession(req, res, next) {
  if(!req.session || !req.session.clientId) {
    res.redirect('/login');
    return;
  }
  next();
}


/**
 *
 * Render profile
 *
 */
function bootstrapClient(req, res, next) {
  res.locals.renderData = res.locals.renderData || {};
  Database.clients.getClientById(req.session.clientId)
    .then((data) => {
      res.locals.renderData.client = data;
    })
    .catch(console.error) // TODO: What should happen when we fail to query the client data? Redirect is poor UX. Should we show some error message?
    .finally(() => {
      next();
    });
}

function renderProfile(req, res) {
  res.locals.renderData = res.locals.renderData || {};
  res.locals.renderData.csrfToken = req.csrfToken();
  res.locals.renderData.clientId = req.session.clientId;
  res.render('profile', res.locals.renderData);
}


/**
 *
 * Render Manage Device
 *
 */
function validateManageDeviceInput(req, res, next) {
  let input = req.params;
  let requiredParams = {
    deviceId: 'string'
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

function verifyDeviceOwnership(req, res, next) {
  let filter = {
    _id: req.params.deviceId,
    client: req.session.clientId
  };
  let select = {
    subscription: 1,
    imei: 1,
    nickname: 1,
    image_url: 1,
    model: 1,
    error_code: 1
  };
  let options = {
    populate: {
      path: 'subscription'
    }
  }
  Database.devices.getDevice(filter, select, options)
    .then((data) => {
      res.locals.device = data;
      next();
    })
    .catch((err) => {
      res.status(403).redirect('/portal');
    });
}

function renderManageDevice(req, res) {
  let renderData = {
    csrfToken: req.csrfToken(),
    device: res.locals.device
  };
  res.render('manage-device', renderData);
}


/**
 *
 * Render Home
 *
 */
function bootstrapSubscriptionsPendingActivation(req, res, next) {
  res.locals.renderData = res.locals.renderData || {};
  Database.subscriptions.getSubscriptionsPendingActivation(req.session.clientId)
    .then((data) => {
      res.locals.renderData.subscriptionsPendingActivation = data.docs;
    })
    .catch(console.error)
    .finally(() => {
      next();
    })
}

function bootstrapDevices(req, res, next) {
  res.locals.renderData = res.locals.renderData || {};
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
      res.locals.renderData.devices = data.docs;
    })
    .catch(console.error)
    .finally(() => {
      next();
    });
}

function renderHome(req, res) {
  res.locals.renderData = res.locals.renderData || {};
  res.locals.renderData.csrfToken = req.csrfToken();
  res.locals.renderData.clientId = req.session.clientId;
  res.render('home', res.locals.renderData);
}


/**
 *
 * Logout
 *
 */
function cleanUpSession(req, res, next) {
  req.session.destroy(function(err) {
    if(err) {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Unable to end session')));
      return;
    }
    next();
  });
}


function redirectToLogin(req, res) {
  res.redirect('/login');
}


module.exports = router;