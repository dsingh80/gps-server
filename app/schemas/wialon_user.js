'use strict';

const mongoose = require('mongoose'),
  paginate = require('mongoose-paginate');

let options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated',
  }
};

let WialonUserSchema = mongoose.Schema({
  client_id: {
    type: mongoose.ObjectId,
    editable: false,
    required: true,
    ref: 'Client',
    unique: true
  },
  wialon_user_id: {
    type: String,
    alias: 'id',
    editable: false,
    trim: true,
    required: true
  },
  wialon_account_id: {
    type: String,
    alias: 'account_id',
    editable: false,
    trim: true,
    required: true
  },
  error_code: {
    type: String,
    editable: true,
    lowercase: true,
    trim: true,
    required: false
  },
  error_message: {
    type: String,
    editable: true,
    trim: true,
    required: false
  },
}, options);

WialonUserSchema.plugin(paginate);


module.exports = WialonUserSchema;