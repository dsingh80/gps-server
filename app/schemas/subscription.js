'use strict';

const mongoose = require('mongoose'),
  paginate = require('mongoose-paginate');

let options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated',
  }
};

let SubscriptionSchema = mongoose.Schema({
  client_id: {
    type: mongoose.ObjectId,
    editable: false,
    required: true,
    ref: 'Client'
  },
  platform: {
    type: String,
    editable: true,
    lowercase: true,
    trim: true,
    required: true
  },
  platform_id: {    // This functions as our id for the subscription. There's a virtual getter on id that will return this value
    type: String,
    alias: 'id',
    editable: false,
    lowercase: true,
    trim: true,
    index: true,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'pending',
    editable: true,
    lowercase: true,
    trim: true,
    required: false
  }
}, options);

SubscriptionSchema.index({ platform: 1, platform_id: 1 }, { unique: true });

SubscriptionSchema.plugin(paginate);


module.exports = SubscriptionSchema;