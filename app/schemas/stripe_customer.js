'use strict';

const mongoose = require('mongoose'),
  paginate = require('mongoose-paginate');

let options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated',
  }
};

let StripeCustomerSchema = mongoose.Schema({
  client_id: {
    type: mongoose.ObjectId,
    editable: false,
    required: true,
    ref: 'Client',
    unique: true
  },
  stripe_customer_id: {
    type: String,
    alias: 'id',
    editable: false,
    trim: true,
    required: true
  }
}, options);

StripeCustomerSchema.plugin(paginate);


module.exports = StripeCustomerSchema;