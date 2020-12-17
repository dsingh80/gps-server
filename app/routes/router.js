/**
 * @file router.js
 * @fileOverview
 * Initial routing entry point for the app
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router();

const ClientRouteHandler = require('./api_clients'),
  DeviceRouteHandler = require('./api_devices'),
  SubscriptionRouteHandler = require('./api_subscriptions');



/**
 *
 * TODO: Add authentication to protected routes
 *
 */


/**
 * Route Definitions
 */
router.use('/clients', ClientRouteHandler);
router.use('/devices', DeviceRouteHandler);
router.use('/subscriptions', SubscriptionRouteHandler);

/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */



module.exports = router;