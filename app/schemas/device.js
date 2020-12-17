'use strict';

const mongoose = require('mongoose'),
  paginate = require('mongoose-paginate');

let options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated',
  }
};

let DeviceSchema = mongoose.Schema({
  subscription_id: {
    type: mongoose.ObjectId,
    editable: true,
    index: true,
    required: false,
    ref: 'Subscription'
  },
  imei: {
    type: String,
    editable: false,
    trim: true,
    unique: true,
    required: true
  },
  iccid: {
    type: String,
    editable: true, // Keep this editable in case anyone wants to change the SIM card on their device
    trim: true,
    unique: true,
    required: false // We may not always create a device with a known SIM card number
  },
  model: {
    type: String,
    editable: true,
    uppercase: true,
    trim: true,
    required: true
  },
  manufacturer: {
    type: String,
    editable: true,
    uppercase: true,
    trim: true,
    required: false
  },
  platform: {
    type: String,
    editable: true,
    lowercase: true,
    trim: true,
    required: true
  },
  platform_id: {    // This functions as our id for the device. There's a virtual getter on id that will return this value
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
  num_network_checks: {
    type: Number,
    editable: true,
    min: 0,
    required: true,
    default: 0
  }
}, options);

DeviceSchema.index({ platform: 1, platform_id: 1 }, { unique: true });

DeviceSchema.plugin(paginate);


module.exports = DeviceSchema;