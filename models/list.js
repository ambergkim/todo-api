'use strict';

const mongoose = require('mongoose');
// const User = require('./user.js');

let listSchema = new mongoose.Schema({
  name: String,
  description: String,
  tasks: [{
    name: String,
    completed: {type: Boolean, default: false}
  }],
});

const List = mongoose.model('List', listSchema);

module.exports = List;