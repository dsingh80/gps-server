'use strict';

const mongoose = require('mongoose'),
  paginate = require('mongoose-paginate');

let UserSchema = mongoose.Schema({
  user: {
    type: 'String',
    required: true
  },
  pwd: {
    type: 'String',
    required: true
  }
});

UserSchema.plugin(paginate);
let User = mongoose.model('User', UserSchema);


module.exports = User;