/**
 * @file api_users.js
 * @fileOverview
 * Handles routes pertaining to the user, login, session, etc.
 * Stored alongside all of the other routing files
 */
'use strict';

const router = require('express').Router();

const Database = require('../classes/Database');

let Users;


/**
 * Route Definitions
 */
router.use(sanitizeInput);
router.get('/login', showLoginPage);
router.post('/login', getUsersCollection, authenticateUser);


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


function getUsersCollection(req, res, next) {
  Users = Database.getUsersCollection();
  next();
}


function showLoginPage(req, res, next) {

}


function authenticateUser(req, res, next) {
  Users.authenticate(req.body.username, req.body.password, function callback(err, data) {
    if (err) {
      res.status(400).send('Invalid login info');
    }
    else { res.status(200).send('Successfully logged in!'); }
  });
}


module.exports = router;