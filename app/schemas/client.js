'use strict';

const mongoose = require('mongoose'),
  paginate = require('mongoose-paginate');

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
    trim: true,
    required: true
  },
  phone: {
    type: String,
    editable: true,
    required: false
  },
  first_name: {
    type: String,
    editable: true,
    lowercase: true,
    trim: true,
    required: false
  },
  last_name: {
    type: String,
    editable: true,
    lowercase: true,
    trim: true,
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

ClientSchema.plugin(paginate);


module.exports = ClientSchema;