'use strict';

const server = require('../server.js');

require('dotenv').config();

const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const SERVER_URL = 'http://localhost:' + PORT;


const MAIN_LIST_URL = SERVER_URL + '/lists';

let testList = {
  name: 'Test List',
  description: 'This is a list created for testing',
  tasks: [
    {
      name: 'test task',
      completed: false
    }
  ]
}

let testListId;

function loadToDo() {
  superagent.post(MAIN_LIST_URL)
  .send(testList)
  .end((err, res) => {
    if (err) {
      console.error('There was an error loading the test list', err);
    }
    console.log('Test list has been loaded successfully', res.status, res.body);

    testListId = res.body._id
  })
};

function emptyToDo() {
  superagent.delete(`${MAIN_LIST_URL}/testListId`)
  .end((err, res) => {
    if (err) {
      console.error('There was an error deleting the test list', err);
    }
    console.log('Test list has been deleted successfully', res.status);
  });
};

describe('All Tests', () => {

  beforeAll(() => {
    server.start;
  }));

  afterAll(() => {
    server.stop;
  });

  beforeEach(() => {
    loadToDo();
  });

  afterEach(() => {
    emptyToDo();
  })

  describe('GET REQUESTS /lists', () => {

    it('should return a string and status 400 for improper GET /lists request', done => {
      superagent.get(MAIN_LIST_URL)
      .end((err, res) => {
        let status = res.status;
        let body = res.body;
        expect(status).toBe(400);
        done();
      });
    });

    it('should return a string and status 200 for a proper GET /lists request', done => {
      superagent.get(MAIN_LIST_URL)
      .end((err, res) => {
        let status = res.status;
        let body = res.body
        expect(status).toBe(200);
        expect(body).toEqual(testList);
        done();
      });
    });

  }); // END GET Request tests


  describe('POST REQUESTS /lists', () => {

    it('should return a status 400 for improper POSTS /lists request with improper json/object in request body', done => {
      let newListBody = {
        anem: 'hello',
        'description': 'impropoer body'
      };
      superagent.get(MAIN_LIST_URL)
      .send(newListBody)
      .end((err, res) => {
        let status = res.status;
        expect(status).toBe(400);
        done();
      })
    });

    it('should return a message and status 409 for a POST request on a list object that already exists', done => {
      let existingList = {

      };
      superagent.get(MAIN_LIST_URL)
      .send(existingList)
      .end(err, res) => {
        let status = res.status;
        expect(status).toBe(409);
        done();
      }
    });

    it('should return a string and status 201 for a valid POST request', done => {
      //test
    });

  }); // END POST Request tests

  describe('GET REQUESTS /lists/:listId', () => {

    it('should return a string and status 404 for improper GET /lists/:id request when the list is not found', done => {
      //test
    });

    it('should return a string and status 400 for a GET /lists/:id request when the id is invalid', done => {
      //test
    });

    it('should return a string and status 200 and valid JSON for a proper GET /lists/:id request', done => {
      //test
    });

  }); // END GET /lists/:id Request tests

  describe('POST REQUESTS /lists/:listId/tasks', () => {

    it('should return a status 400 for improper POST /lists/:id/tasks request when request has invalid body', done => {
      //test
    });

    it('should return a status 409 for a POST /lists/:id/tasks request when a task already exists', done => {
      //test
    });

    it('should return status 201 and valid JSON for a proper GET /lists/:id/tasks request', done => {
      //test
    });

  }); // END GET /lists/:id Request tests

  describe('POST REQUESTS /lists/:listId/tasks/:taskId/complete', () => {

    it('should return a status 400 for improper POST /lists/:listId/tasks/:taskId/complete request when request has invalid body', done => {
      //test
    });

    it('should return status 201 and valid JSON for a proper POST /lists/:listId/tasks/:taskId/complete request', done => {
      //test
    });

  }); // END GET /lists/:id Request tests

}); // END All List tests
