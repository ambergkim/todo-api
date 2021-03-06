# TODO API by Amber Kim

A simple To Do List API built with JavaScript + Node.js

## Table of Contents
* [Using the App](#use)
    * [GET all Lists](#getall)
    * [GET Lists with query strings](#getquery)
    * [GET List by Id](#getlist)
    * [Create new list](#postlist)
    * [Create new task](#posttask)
    * [Mark task as complete](#completetask)
    * [Delete all lists and tasks](#clear)
* [Technologies](#technologies)
* [Local Development Instructions](#development)


## <a name="use"></a>Using The App

You can start using the deployed API through this base URL. The application is deployed using a free Heroku account so it may take a little bit before the dyno wakes up.

BASE URL
```
https://amber-todo-api.herokuapp.com/lists
```


### Retrieving lists with GET requests

#### <a name="getall"></a>GET all the lists template URL:
```
https://amber-todo-api.herokuapp.com/lists
```

Example return from a basic GET all request.
Returns with status code 200
```json
[
    {
        "tasks": [
            {
                "complete": false,
                "_id": "5b6de4a18e14e784c747965d",
                "name": "hello world",
                "__v": 0
            }
        ],
        "_id": "5b6de4968e14e784c747965c",
        "name": "done",
        "__v": 0
    }
]
```

##### <a name="getquery"></a>Query string options
Limit for limiting the number of results that will be returned, Skip for skipping over a certain number of results, and search to search for a specific list containing a string.
```
?limit=<int>
?skip=<int>
?search=<word>
```

ERRORS:
* Unregisterd routes will return 404 Error getting lists


#### <a name="getlist"></a>GET a specific list by Id template URL:
```
https://amber-todo-api.herokuapp.com/lists/<id>
```


Example return when getting a specific list by Id.
Returns with a status code of 200.
```json
[
    {
        "tasks": [
            {
                "complete": false,
                "_id": "5b6de4a18e14e784c747965d",
                "name": "hello world",
                "__v": 0
            }
        ],
        "_id": "5b6de4968e14e784c747965c",
        "name": "done",
        "__v": 0
    }
]
```

ERRORS:
* Requests using invalid Id's will return 400 Invalid Id
* Requests using valid Id's of non-existing lists 


### <a name="postlist"></a>Create a new list using a POST request

Create a new List via POST
```
https://amber-todo-api.herokuapp.com/lists
```

example request body
```json
{
	"name": "testing",
	"description": "Hello world!"
}
```

Sample return from posting a new list.
Returns with a status code of 201.
```json
{
    "tasks": [],
    "_id": "5b6b882f69f31a0f223486e4",
    "name": "testing",
    "description": "Hello world!",
    "__v": 0
}
```

ERRORS:
* Lists with duplicate name keys will return a 409 error.
* Other invalid requests will return 400 errors.


### <a name="posttask"></a>Adding new tasks to a list using a POST request

Route Template:
```
https://amber-todo-api.herokuapp.com/lists/<id>/tasks
```

example request body
```json
{
	"name": "Testing the tasks"
}
```

Example return from adding a new task to a List.
Returns with a status code of 201.
```json
{
    "tasks": [
        {
            "complete": false,
            "_id": "5b6de4a18e14e784c747965d",
            "name": "hello world",
            "__v": 0
        }
    ],
    "_id": "5b6de4968e14e784c747965c",
    "name": "done",
    "__v": 0
}
```

ERRORS:
* Requests with invalid request bodies will send a 400 status code.
* Other invalid requests will send a 409 status code.


### <a name="completetask"></a>Updating a task to be 'marked' as complete

Route Template:
```
https://amber-todo-api.herokuapp.com/lists/<id>/tasks/:taskId/complete
```

example request body
```json
{
	"complete": true
}
```

Example return from 'marking' a task as complete.
Returns with a status code of 201
```json
{
    "complete": true,
    "_id": "5b6b891369f31a0f223486e5",
    "name": "Testing the tasks",
    "__v": 0
}
```

ERRORS:
* Invalid request bodies will send a status code 400
* Other invalid requests will return 400 as well

### <a name="clear"></a>Clearing away all the lists and tasks
!Warning! This will clear out the database.

Route Template:
```
https://amber-todo-api.herokuapp.com/lists/clear
```

Proper requests will return with a status code of 204.

ERRORS:
* Invalid DELETE requests for this route will return a 400 error.


## <a name="technologies"></a>Technologies

Server:
* JavaScript
* Node JS
* Express

Relational Database:
* MongoDB
* Mongoose

For Test Driven Development:
* SuperAgent
* Jest

Deployment and Continuous Integration
* Heroku
* Travis CI


## <a name="development"></a>Local Development Instructions


### Installation

* Make sure you have an updated version of npm on your machine.

1. Clone down the repository to your machine
2. Navigate to the root folder of your new repository
3. Install dependencies using
```
npm install
```
4. Create a new .env file with the environments as sampled in the .sampleenv file found in this repository.


### Running the Server

1. Navigate to the root of the repository.
2. Run one of these commands in your terminal:
```
npm run start
```
or
```
node index.js
```
or if you have nodemon installed
```
nodemon index.js
```
or 
```
nodemon
```


### Running the tests

To run the included tests, navigate to the root of the repo and run this in your terminal:
```
npm run test
```


### Using the application locally

Upon running the server, the app is set to run on localhost:3000 by default.

You can run the GET reequests using your browser, but the use of a tool like Postman is recommended.