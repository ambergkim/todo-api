'use strict';

const mongoose = require('mongoose');
const Task = require('./task.js');

let listSchema = new mongoose.Schema({
  name: String,
  description: String,
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
});

const List = mongoose.model('List', listSchema);

module.exports = List;