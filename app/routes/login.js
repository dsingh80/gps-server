/**
 * @file login.js
 * @fileOverview
 * Routes relating to login and logout
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router();

const utils = require('../utils'),
  Database = require('../classes/Database');

/**
 * Route Definitions
 */
router.get('/', renderLoginForm);
router.post('/', validateLoginInput, authenticateUser);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */
function renderLoginForm(req, res) {
  if(req.session.clientId) {
    res.redirect('/portal');
    return;
  }
  let renderData = {
    csrfToken: req.csrfToken()
  };
  res.render('login', renderData);
}


function validateLoginInput(req, res, next) {
  if(req.session.clientId) {
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
          req.session.clientId = doc._id;
          res.redirect('/portal');
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    });
}


module.exports = router;