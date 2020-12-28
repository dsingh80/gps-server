/**
 * @file login.js
 * @fileOverview
 * Routes relating to login and logout
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router(),
  csurf = require('csurf');

const utils = require('../utils'),
  Database = require('../classes/Database');

/**
 * Route Definitions
 */
router.get('/login', renderLoginForm);
router.post('/login', validateLoginInput, authenticateUser, renderLoginError);
router.get('/logout', cleanUpSession, redirectToLogin);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */
function renderLoginForm(req, res) {
  if(req.session.client_id) {
    res.redirect('/portal');
    return;
  }
  let renderData = {
    csrfToken: req.csrfToken()
  };
  res.render('login', renderData);
}


function validateLoginInput(req, res, next) {
  if(req.session.client_id) {
    res.redirect('/portal');
    return;
  }
  let input = req.body;
  let requiredParams = {
    email: 'string',
    password: 'string'
  };
  let optionalParams = {
    _csrf: 'string' // may be passed in some other way (header, cookie, etc)
  };
  if(!utils.typeCheck(input, requiredParams, true, false) || !utils.typeCheck(input, optionalParams)) {
    let renderData = {
      csrfToken: input._csrf || req.csrfToken()
    };
    res.render('login', renderData);
  }

  next();
}


function authenticateUser(req, res, next) {
  let input = req.body;
  Database.clients.authenticate(input.email, input.password)
    .then((doc) => {
          req.session.client_id = doc._id;
          res.redirect('/portal');
    })
    .catch((err) => {
      req.session.err = err.message;
      next();
    });
}


function renderLoginError(req, res) {
  let renderData = {
    csrfToken: req.body._csrf || req.csrfToken(),
    err: req.session.err || 'Invalid login credentials. Please check your input'
  };
  res.render('login', renderData);
}


function cleanUpSession(req, res, next) {
  req.session.destroy(function(err) {
    if(err) {
      res.status(400).send(utils.buildPayload(utils.RequestStatus.FAIL, 'Unable to end session'));
      return;
    }
    next();
  });
}


function redirectToLogin(req, res) {
  res.redirect('/login');
}

module.exports = router;