'use strict';

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const List = require('../models/list.js');
const Task = require('../models/task.js');

const DATABASE_URL = process.env.MONGODB_URI;

mongoose.connect(DATABASE_URL, { useNewUrlParser: true });
const router = express.Router();

router.get('/', (req, res) => {
  if (req.params.id) {
    let listId = req.params.id;
  }

  if (req.params.id) {

  }
  List.find()
    .then(lists => {
      res.status(200).send(lists);
    })
    .catch(err => {
      res.status(404).send('Error getting lists');
    })
});

router.get('/:id', (req, res) => {
  
  if (req.params.id.length === 24) {
    let listId = req.params.id;
    List.find({_id: listId})
      .then(lists => {
        if (lists.length === 0) {
          res.status(404).send('Not Found');
        } else {
          res.status(200).send(lists);
        }
      })
      .catch(err => {
        res.status(400).send('Error getting lists');
      })
  } else {
    res.status(400).send('Invalid Id');
  }
});

router.post('/', (req, res) => {
  let newListInfo = req.body;

  if (!newListInfo.name) {
    res.status(400).send('Invalid Body');
  } else {

    List.findOne({ name: newListInfo.name })
      .then(list => {
        if (list) {
          res.status(409).send('Error saving list, duplicate found');
        } else {
          let newList = new List(newListInfo);
          return newList.save()
        }
      })
      .then(list => {
        res.status(201).send(list);
      })
      .catch(err => {
        console.error('Error saving new list', err.status);
        res.status(400).send('Error saving new list');
      })

  }
});

router.post('/:id/tasks', (req, res) => {
  let listId = req.params.id;
  let body = req.body;
  let taskName = req.body.name;
  let newTaskId;

  if (!taskName) {
    res.status(400).send('Invalid request body');
  } else if (taskName) {
    List.findOne({_id: listId})
    .populate({path: 'tasks'})
    .then(list => {
      let tasks = list.tasks;
      let taskIndex = tasks.findIndex(task => {
        return task.name === taskName;
      })
      if (taskIndex === -1) {
        let newTask = new Task(body);
        return newTask.save();
      } else if (taskIndex > -1) {
        throw new Error('Duplicate Task');
      }
    })
    .then(task => {
      newTaskId = task._id
      return List.findOneAndUpdate({_id: listId}, {$push: {tasks: newTaskId}}).populate({path: 'tasks'});
    })
    .then(() => {
      return List.findOne({_id: listId})
    })
    .then(list => {
      res.status(201).send(list);
    })
    .catch(err => {
      res.status(409).send(err);
    })
  }
});

router.put('/:id/tasks/:taskId/complete', (req, res) => {
  let listId = req.params.id;
  let taskId = req.params.taskId;
  let reqBody = req.body;

  if (reqBody.complete !== true && reqBody.complete !== false) {
    res.status(400).send('Invalid Body');
  } else {

    Task.findOneAndUpdate({_id: taskId}, {complete: reqBody.complete})
    .then(task => {
      return Task.findOne({_id: taskId})
    })
    .then(task => {
      res.status(201).send(task);
    })
    .catch(err => {
      res.status(400).send('Error Updating Task');
    })
  }
});

router.delete('/clear', (req, res) => {
  List.find()
  .then(lists => {
    if (lists.length > 0) {
      console.log('found lists');
      return List.remove({});
    }
  })
  .then(() => {
    return Task.find()
  })
  .then(tasks => {
    if (tasks.length > 0) {
      console.log('found tasks');
      return Task.remove({});
    }
  })
  .then(() => {
    res.status(204).send();
  })
  .catch(err => {
    res.status(400).send('Error with clearing db');
  })
});



module.exports = router;