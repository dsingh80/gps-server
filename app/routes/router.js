/**
 * @file router.js
 * @fileOverview
 * Initial routing entry point for the app
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router(),
  csurf = require('csurf');

const csrf = csurf({});


/**
 * Route Definitions
 */
router.use(csrf);  // any routes declared after this will require csrf tokens to pass. This means, these routes should only be hit from our own website
router.use('/login', require('./login'));
router.use('/change-password', require('./change-password'));
router.use('/client', require('./client'));
router.use('/portal', require('./portal'));
router.use('/device', require('./device'));
router.use('/subscription', require('./subscription'));
router.use('/', redirectToPortal);
router.use(csrfErrorHandler);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */
function redirectToPortal(req, res) {
  res.redirect('/portal');
}


function csrfErrorHandler(err, req, res, next) {
  if(err.code == 'EBADCSRFTOKEN') {
    return res.status(403).json('Forbidden');
  }
  next(err);
}


module.exports = router;