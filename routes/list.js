'use strict';

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const List = require('../models/list.js');

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

router.delete('/:id', (req, res) => {
  let listId = req.params.id;
  List.findOne({ _id: listId })
    .then(list => {
      if (!list) {
        throw new Error('Unable to find list to delete');
      }
      return List.remove({
        _id: listId
      });
    })
    .then(deletedList => {
      res.status(204).send();
    })
    .catch(err => {
      console.error('delete error', err);
      res.status(404).send(err);
    });
});



module.exports = router;