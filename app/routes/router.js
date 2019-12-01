/**
 * @file router.js
 * @fileOverview
 * Initial routing entry point for the app
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router();

const UsersRouteHandler = require('./api_users');


/**
 * Route Definitions
 */
router.use('/u', UsersRouteHandler);
router.use('/', redirectToLogin);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */
function redirectToLogin(req, res, next) {
  res.redirect('/u/login');
}


module.exports = router;