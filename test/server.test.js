'use strict';

const server = require('../server.js');

require('dotenv').config();

const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const SERVER_URL = 'http://localhost:' + PORT;
const mongoose = require('mongoose');

const MAIN_LIST_URL = SERVER_URL + '/lists';
console.log(MAIN_LIST_URL);

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
      .end((er, res) => {
        let loadedList = res.body;
        testList = res.body;
        testListId = testList._id;
      })
    }
  });
};

// function emptyToDo() {
//   superagent.delete(`${MAIN_LIST_URL}/${testListId}`)
//     .end((err, res) => {
//       if (err) {
//         console.error('There was an error deleting the test list', err);
//       }
//       console.log('Test list has been deleted successfully', res.status);
//     });
// };

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
          let body = res.body;
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
      .end((err, res) => {
        expect(res.status).toBe(409);
        done();
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
        expect(res.status).toBe(201);
        done();
      })
    });

  }); // END POST /lists/:id/tasks Request tests

  describe.skip('POST REQUESTS /lists/:listId/tasks/:taskId/complete', () => {

    it('should return a status 400 for improper POST /lists/:listId/tasks/:taskId/complete request when request has invalid body', done => {
      let testURL = MAIN_LIST_URL + '/' + testListId + '/tasks';
    });

    it('should return status 201 and valid JSON for a proper POST /lists/:listId/tasks/:taskId/complete request', done => {
      //test
    });

  }); // END POST /lists/:listId/tasks/:taskId/complete Request tests

}); // END All List tests
