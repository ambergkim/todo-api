'use strict';

const mongoose = require('mongoose');

let taskSchema = new mongoose.Schema({
  name: String,
  complete: {type: Boolean, default: false}
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;