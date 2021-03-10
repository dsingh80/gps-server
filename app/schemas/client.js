'use strict';

const mongoose = require('mongoose'),
  paginate = require('mongoose-paginate'),
  utils = require('../utils'),
  path = require('path');

const ApplicationError = utils.ApplicationError;

//
// Services Config
//
const servicesConfig = utils.requireUncached(path.join(__dirname, '../..', 'config/services'));
let _services;
if (process.env.NODE_ENV == 'development') {
  _services = servicesConfig.development;
}
else _services = servicesConfig.production;

//
// Crypto
//
let crypto;
try {
  crypto = require('crypto');
}
catch(err) {
  throw 'Current NodeJS build does not support required module: `crypto`. Please make sure NodeJS was built with the crypto module. For more information visit https://nodejs.org/api/crypto.html';
}

//
// Constants
//
const HASH_KEY_LENGTH = 64;
const SALT_LENGTH = 16; // minimum recommended size is 16


let options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated',
  }
};

let ClientSchema = mongoose.Schema({
  email: {
    type: String,
    editable: true,
    unique: true,
    lowercase: true,
    select: true,
    trim: true,
    required: true
  },
  password: {
    type: Buffer,
    editable: true,
    select: false,
    required: false
  },
  salt: {
    type: Buffer,
    editable: true,
    required: false
  },
  phone: {
    type: String,
    editable: true,
    select: true,
    required: false
  },
  first_name: {
    type: String,
    editable: true,
    lowercase: false,
    select: true,
    trim: true,
    required: false
  },
  last_name: {
    type: String,
    editable: true,
    lowercase: false,
    select: true,
    trim: true,
    required: false
  },
  last_logged_in: {
    type: Date,
    editable: true,
    select: true,
    required: false
  },
  last_login_attempt: {
    type: Date,
    editable: true,
    select: true,
    required: false
  },
  failed_login_attempts: {
    type: Number,
    default: 0,
    editable: true,
    min: 0,
    max: _services.server.MAX_LOGIN_ATTEMPTS,
    select: false,
    required: false
  },
  locked_until: {
    type: Date,
    editable: true,
    select: false,
    required: false
  },
  password_reset_token: {
    type: String,
    editable: true,
    select: false,
    trim: true,
    required: false
  },
  password_reset_expiration: {
    type: Date,
    editable: true,
    select: false,
    required: false
  }
}, options);


ClientSchema.virtual('name')
  .get(function getFullName() {
    if(!this.first_name && !this.last_name) { return null; }
    let fullName = this.first_name || '';
    fullName += ' ';
    fullName +=  this.last_name || '';
    return fullName.trim();
  });


ClientSchema.method('setPassword', function(password) {
  this.salt = crypto.randomBytes(SALT_LENGTH);
  this.password = crypto.pbkdf2Sync(password, this.salt, 1000, HASH_KEY_LENGTH, `sha512`);
  return this.save();
});
ClientSchema.method('validatePassword', async function(password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, this.salt, 1000, HASH_KEY_LENGTH, `sha512`, (err, hash) => {
      if(err) { reject(new ApplicationError(utils.getMongoError(err))); return; }
      if (Buffer.compare(hash, this.password)) { reject(ApplicationError('Unable to validate password')); return; }
      resolve();
    });
  });
});


ClientSchema.plugin(paginate);


module.exports = ClientSchema;