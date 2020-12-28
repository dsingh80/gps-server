/**
 * @file router.js
 * @fileOverview
 * Initial routing entry point for the app
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router(),
  csurf = require('csurf');

const utils = require('../utils'),
  Database = require('../classes/Database'),
  ClientRouteHandler = require('./api_clients'),
  DeviceRouteHandler = require('./api_devices'),
  SubscriptionRouteHandler = require('./api_subscriptions');

const csrf = csurf({});


/**
 * Route Definitions
 */
router.use(csrf);  // any routes declared after this will require csrf tokens to pass. This means, these routes should only be hit from our own website
router.use(require('./login'));
router.use('/portal', renderPortal)
router.use('/clients', ClientRouteHandler);
router.use('/devices', DeviceRouteHandler);
router.use('/subscriptions', SubscriptionRouteHandler);
router.use(csrfErrorHandler);


function renderPortal(req, res) {
  if(!req.session.client_id) {
    res.redirect('/login');
    return;
  }
  let renderData = {
    csrfToken: req.csrfToken()
  };

  Database.subscriptions.getClientSubscriptions(req.session.client_id)
    .then((subscriptions) => {
      let filter = {
        subscription_id: {
          $in: subscriptions.docs.map((sub) => sub._id)
        }
      };
      Database.devices.listDevices(filter)
        .then((devices) => {
          renderData.subscriptions = subscriptions;
          renderData.devices = devices;
          console.info(renderData);
          res.render('portal', renderData);
        })
        .catch(console.error);
    })
    .catch(console.error);
}


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */
function csrfErrorHandler(err, req, res, next) {
  if(err.code == 'EBADCSRFTOKEN') {
    return res.status(403).send('Forbidden');
  }
  next(err);
}


module.exports = router;