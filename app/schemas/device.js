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
  subscription: {
    type: mongoose.ObjectId,
    editable: true,
    index: true,
    required: false,
    ref: 'Subscription'
  },
  client: {
    type: mongoose.ObjectId,
    editable: true,
    index: true,
    required: false,
    ref: 'Client'
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
  nickname: {
    type: String,
    editable: true,
    uppercase: false,
    trim: true,
    required: false
  },
  image_url: {
    type: String,
    default: '',
    editable: true,
    lowercase: true,
    trim: true,
    required: true
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

DeviceSchema.index({ platform: 1, platform_id: 1 }, { sparse: true });

DeviceSchema.plugin(paginate);


module.exports = DeviceSchema;