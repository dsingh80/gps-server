/**
 * @file change-password.js
 * @fileOverview
 * Routes relating to resetting a forgotten password. A separate route handler exists for an authenticated user who wishes to change their password.
 * Should be stored in app/routes with all the other route handlers
 */
'use strict';

const router = require('express').Router();

const crypto = require('crypto'),
  utils = require('../utils'),
  Database = require('../classes/Database');

/**
 * Route Definitions
 */
router.post('/', validateGenerateResetPasswordTokenInput, generateResetPasswordToken);
router.get('/', renderResetPasswordForm);
router.put('/', validateChangePasswordInput, checkResetTokenExpiration, changePassword, redirectToLogin);


/**
 * =========================================
 *
 * Routes Handlers
 *
 * =========================================
 */
/**
 *
 * Generate reset password token
 *
 */
function validateGenerateResetPasswordTokenInput(req, res, next) {
  let input = req.body;
  let optionalParams = {
    _csrf: 'string' // may be passed in some other way (header, cookie, etc)
  };
  let requiredParams = {
    email: 'string'
  };
  if(!utils.typeCheck(input, optionalParams) || !utils.typeCheck(input, requiredParams, true)) {
    res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Invalid inputs')));
    return;
  }

  next();
}

function generateResetPasswordToken(req, res, next) {
  let input = req.body;
  let hash = crypto.createHash('sha256');

  // Use the client's email and the current timestamp to generate a password reset token. It's not meant to be cryptographically secure, just unique
  // As a security backup, the client's password_reset_expiration cannot be set until this route has been executed. Attackers should not have any access to change that property
  hash.update(input.email.toLowerCase() + Date.now().toString());

  let filter = {
    email: input.email
  };
  let updates = {
    password_reset_token: hash.digest('hex'),
    password_reset_expiration: new Date(Date.now() + req.app.get('config').PASSWORD_RESET_EXPIRATION)
  };

  Database.clients.updateClient(filter, updates)
    .then((doc) => {
      res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS));
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    })
}


/**
 *
 * Show password reset form
 *
 */
function renderResetPasswordForm(req, res) {
  let renderData = {
    csrfToken: req.csrfToken()
  };
  res.render('change-password', renderData);
}


/**
 *
 *
 * Change Password
 *
 */
function validateChangePasswordInput(req, res, next) {
  let input = req.body;
  let optionalParams = {
    _csrf: 'string' // may be passed in some other way (header, cookie, etc)
  };
  let requiredParams = {
    resetPasswordToken: 'string',
    newPassword: 'string',
    newPasswordVerify: 'string'
  };
  if(!utils.typeCheck(input, optionalParams) || !utils.typeCheck(input, requiredParams, true)) {
    res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Invalid inputs')));
    return;
  }

  next();
}

function checkResetTokenExpiration(req, res, next) {
  let input = req.body;

  let filter = {
    password_reset_token: input.resetPasswordToken
  };
  let select = {
    email: true,
    password_reset_token: true,
    password_reset_expiration: true
  };
  Database.clients.getClient(filter, select)
    .then((doc) => {
      if(doc.password_reset_expiration <= new Date()) {
        res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Password reset token has expired')));
        return;
      }
      res.locals.clientId = doc._id;
      next();
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, new utils.ApplicationError('Invalid password reset token')));
    });

}

function changePassword(req, res) {
  let input = req.body;
  Database.clients.updatePassword(res.locals.clientId, input.newPassword)
    .then((doc) => {
      res.status(200).json(utils.buildPayload(utils.RequestStatus.SUCCESS));
      doc.password_reset_expiration = new Date();
      doc.password_reset_token = null;
      doc.save()
        .then(()=>{})
        .catch(()=>{});
    })
    .catch((err) => {
      res.status(400).json(utils.buildPayload(utils.RequestStatus.FAIL, err));
    });
}

function redirectToLogin(req, res) {
  res.redirect('/login');
}

module.exports = router;