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
  client: {
    type: mongoose.ObjectId,
    editable: false,
    required: true,
    ref: 'Client'
  },
  activated: {
    type: Boolean,
    default: false,
    editable: true,
    required: true
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
    editable: true,
    lowercase: true,
    trim: true,
    required: false
  },
  name: {
    type: String,
    editable: true,
    trim: true,
    required: true
  },
  price: {
    type: Number,
    editable: true,
    required: true
  },
  charge_interval_frequency: {
    type: Number,
    editable: true,
    min: 0,
    required: true
  },
  charge_interval_unit: {
    type: String,
    editable: true,
    lowercase: true,
    trim: true,
    required: true
  }
}, options);

SubscriptionSchema.index({ platform: 1, platform_id: 1 }, { unique: true });

SubscriptionSchema.plugin(paginate);


module.exports = SubscriptionSchema;