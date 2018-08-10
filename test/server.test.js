'use strict';

const server = require('../server.js');

require('dotenv').config();

const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const SERVER_URL = 'http://localhost:' + PORT;
const mongoose = require('mongoose');

const MAIN_LIST_URL = SERVER_URL + '/lists';

let testListTemplate = {
  name: 'Test List',
  description: 'This is a list created for testing',
  task: [
    {
      name: 'Duplicate Task'
    }
  ]
}

let testList;
let testListId;

function loadToDo() {
  return superagent.get(MAIN_LIST_URL)
    .then(res => {
      let lists = res.body
      if (lists.length > 0) {
        testList = lists[0];
        testListId = testList._id;
      } else if (lists.length === 0) {
        superagent.post(MAIN_LIST_URL)
          .send(testListTemplate)
          .end((err, res) => {
            testList = res.body;
            testListId = testList._id;
          })
      }
    });
};

describe('All Tests', () => {

  beforeAll(() => {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGODB_URI);
    }
    server.start();
  });

  beforeEach(() => {
    return loadToDo();
  });

  afterAll(() => {
    server.stop();
    mongoose.disconnect();
  });


  describe('GET REQUESTS /lists', () => {

    it('should return a status 400 for improper GET /lists request', done => {
      superagent.get(SERVER_URL + '/wrongurl')
        .end((err, res) => {
          let status = res.status;
          expect(status).toBe(404);
          done();
        });
    });

    it('should return correct json and status 200 for a proper GET /lists request', done => {
      superagent.get(MAIN_LIST_URL)
        .end((err, res) => {
          let status = res.status;
          let list = res.body[0];
          let responseType = typeof list;
          expect(status).toBe(200);
          expect(responseType).toBe('object');
          done();
        });
    });

    it('should return correct json and status 200 for GET requests with the correct query strings for skip and limit', done => {
      let testBody1 = {
        name: 'test1'
      };
      let testBody2 = {
        name: 'test2'
      };
      superagent.post(MAIN_LIST_URL)
      .send(testBody1)
      .end((err, res) => {
        superagent.post(MAIN_LIST_URL)
        .send(testBody2)
        .end((err, res) => {
          let queryUrl = MAIN_LIST_URL + '?skip=1&limit=1';
          superagent.get(queryUrl)
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toEqual(1);
            done();
          })
        })
      });
    })

    it('should return correct json and status 200 for GET requests with the correct query string for search', done => {
      let testBody3 = {
        name: 'test3'
      };
      superagent.post(MAIN_LIST_URL)
      .send(testBody3)
      .end((err, res) => {
        let searchQueryUrl = MAIN_LIST_URL + '?search=test3';
        superagent.get(searchQueryUrl)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body[0].name).toEqual('test3');
          done();
        })
      });
    })

  }); // END GET /lists Request tests


  describe('POST REQUESTS /lists', () => {

    it('should return a status 400 for improper POSTS /lists request with no body', done => {
      let emptyBody = {
      };
      superagent.post(MAIN_LIST_URL)
        .send(emptyBody)
        .end((err, res) => {
          let status = res.status;
          expect(status).toBe(400);
          done();
        })
    });

    it('should return a message and status 409 for a POST request on a list object that already exists', done => {
      superagent.post(MAIN_LIST_URL)
        .send(testList)
        .end((err, res) => {
          let status = res.status;
          expect(status).toBe(409);
          done();
        })
    });

    it('should return a string and status 201 for a valid POST request', done => {
      let newList = {
        name: 'name' + Math.random(),
        description: 'description' + Math.random()
      }
      superagent.post(MAIN_LIST_URL)
        .send(newList)
        .end((err, res) => {
          expect(res.status).toBe(201);
          expect(res.body.name).toEqual(newList.name);
          done();
        })
    });

  }); // END POST /lists Request tests

  describe('GET REQUESTS /lists/:listId', () => {

    it('should return a status 404 for improper GET /lists/:id request when the list is not found', done => {
      superagent.get(MAIN_LIST_URL + '/5b6a179a0c812a9045fe1111')
        .end((err, res) => {
          expect(res.status).toBe(404);
          done();
        })
    });

    it('should return a status 400 for a GET /lists/:id request when the id is invalid', done => {
      superagent.get(MAIN_LIST_URL + '/123')
        .end((err, res) => {
          expect(res.status).toBe(400);
          done();
        })
    });

    it('should return a string and status 200 and valid JSON for a proper GET /lists/:id request', done => {
      let testURL = MAIN_LIST_URL + '/' + testListId;
      superagent.get(testURL)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body[0]).toEqual(testList);
          done();
        })
    });

  }); // END GET /lists/:listId Request tests

  describe('POST REQUESTS /lists/:listId/tasks', () => {

    it('should return a status 400 for improper POST /lists/:id/tasks request when request has an invalid body', done => {
      let testURL = MAIN_LIST_URL + '/' + testListId + '/tasks';
      superagent.post(testURL)
        .end((err, res) => {
          expect(res.status).toBe(400);
          done();
        })
    });

    it('should return a status 409 for a POST /lists/:id/tasks request when a task already exists', done => {
      let testURL = MAIN_LIST_URL + '/' + testListId + '/tasks';
      let testBody = {
        name: 'Duplicate Task'
      }
      superagent.post(testURL)
        .send(testBody)
        .then((err, res) => {
          superagent.post(testURL)
            .send(testBody)
            .end((err, res) => {
              expect(res.status).toBe(409);
              done();
            })
        })
    });

    it('should return status 201 and valid JSON for a proper GET /lists/:id/tasks request', done => {
      let testURL = MAIN_LIST_URL + '/' + testListId + '/tasks';
      let testBody = {
        name: 'Random Task' + Math.random()
      }
      superagent.post(testURL)
        .send(testBody)
        .end((err, res) => {
          let tasks = res.body.tasks;
          let taskFound = tasks.filter(task => {
            if (task.name === testBody.name) {
              return task;
            }
          });
          expect(res.status).toBe(201);
          expect(taskFound[0].name).toEqual(testBody.name);
          done();
        })
    });

  }); // END POST /lists/:id/tasks Request tests

  describe('PUT REQUESTS /lists/:listId/tasks/:taskId/complete', () => {

    it('should return a status 400 for improper POST /lists/:listId/tasks/:taskId/complete request when request has invalid body', done => {
      let testURL = MAIN_LIST_URL + '/' + testListId + '/tasks';
      let testBody = {
        name: 'Random Task' + Math.random()
      }
      superagent.post(testURL)
      .send(testBody)
      .end((err, res) => {
        let newTask = res.body;
        let newTaskId = newTask._id;

        let taskUpdateUrl = MAIN_LIST_URL + '/' + testListId + '/tasks/' + newTaskId + '/complete';

        superagent.put(taskUpdateUrl)
        .end((err, res) => {
          expect(res.status).toBe(400);
          done();
        })
      })
    });

    it('should return status 201 and valid JSON for a proper POST /lists/:listId/tasks/:taskId/complete request', done => {
      let testURL = MAIN_LIST_URL + '/' + testListId + '/tasks';
      let testBody = {
        name: 'Random Task' + Math.random()
      }
      superagent.post(testURL)
      .send(testBody)
      .end((err, res) => {
        let newTask = res.body;
        let newTaskId = newTask._id;

        let taskUpdateUrl = MAIN_LIST_URL + '/' + testListId + '/tasks/' + newTaskId + '/complete';

        superagent.put(taskUpdateUrl)
        .send({
          complete: true
        })
        .end((err, res) => {
          expect(res.status).toBe(201);
          done();
        })
      })
    });

  }); // END PUT /lists/:listId/tasks/:taskId/complete Request tests

  describe('DELETE Tests for /clear', () => {
    it('should delete all lists', done => {
      let deleteUrl = MAIN_LIST_URL + '/clear';
      superagent.delete(deleteUrl)
      .end((err, res) => {
        expect(res.status).toBe(204);
        superagent.get(MAIN_LIST_URL)
        .end((err, res) => {
          let lists = res.body;
          expect(lists.length).toBe(0);
          done();
        })
      })
    })
  }); // END DELETE /clear request test

}); // END All List tests
