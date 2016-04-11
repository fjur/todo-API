var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];


app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Todo API ROOT');
})

//GET /todos?completed=true&q=work
app.get('/todos', function(req, res) {
  var query = req.query;
  var where = {};

  if (query.hasOwnProperty('completed') && query.completed === 'true'){
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false'){
    where.completed = false;
  }

  if (query.hasOwnProperty('q') && query.q.length > 0){
    where.description = {
      $like: '%' + query.q + '%'
    }
  }

  db.todo.findAll({where: where}).then(function(todos){
      res.json(todos); 
  }, function(e){
    res.status(500).send();
  });

  // var filteredTodos = todos;

  // if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
  //   filteredTodos = _.where(filteredTodos, {
  //     completed: true
  //   });
  // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
  //   filteredTodos = _.where(filteredTodos, {
  //     completed: false
  //   });
  // }

  // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
  //   filteredTodos = _.filter(filteredTodos, function(todo) {
  //     return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
  //   });
  // }

  // res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = req.params.id

  db.todo.findById(todoId).then(function(todo){
    if (!!todo){ //!! converts an object to truthy or falsey
      res.json(todo.toJSON());
    } else {
      res.status(404).send();
    }
  }, function(e){
    res.status(500).send();
  });

  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // }); //where is part of underscore library

  // if (matchedTodo) {
  //   res.json(matchedTodo);
  // } else {
  //   res.status(404).send();
  // }

  // res.status(404).send();
  // res.send('Asking for a todo with id of ' + req.params.id);
});

//POST /todos
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed'); //req.body;
  // console.log("description: " + body.description);

  db.todo.create(body).then(function(todo){
    res.json(todo.toJSON());
  }, function(e){
    res.status(400).json(e);
  });

  // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  //   return res.status(400).send();
  // }

  // // set body.description to be trimmed value
  // body.description = body.description.trim();

  // // add id field
  // body.id = todoNextId++;

  // // push body into array
  // todos.push(body);

  // res.json(body);
});

//Delete /todos/:id
app.delete('/todos/:id', function(req, res) { //use _.without
  var toDoId = parseInt(req.params.id, 10);

  // db.todo.findById(toDoId).then(function(todo){
  //   if (todo){
  //     return todo.destroy();
  //   } else {
  //     res.status(404).send();
  //   }
  // }).then(function(todo){
  //   res.json(todo)
  // }).catch(function(e){
  //   res.status(500).send();
  // });

  db.todo.destroy({
    where: {
      id: toDoId
    }
  }).then(function(rowsDeleted){
    if (rowsDeleted === 0 ){
      res.status(404).json({
        error: 'No todo with id'
      });
    } else {
      res.status(204).send();
    }
  }, function(){
    res.status(500).send();
  });


  // var matchedTodo = _.findWhere(todos, {
  //   id: toDoId
  // }); //todos[toDoId];

  // if (matchedTodo) {
  //   todos = _.without(todos, matchedTodo);
  //   res.json(matchedTodo); //res.json is same as res.send but sends json back
  // } else {
  //   res.status(404).json({
  //     "error": "no todo found with that id"
  //   });
  // }

});

// Put /todos/:id
app.put('/todos/:id', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed'); //req.body;
  var validAttributes = {};

  var toDoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {
    id: toDoId
  }); //todos[toDoId];

  if (!matchedTodo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(404).send();
  }

  _.extend(matchedTodo, validAttributes);
  //objects in JS are passed by reference
  res.json(matchedTodo);

});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express listening on port: ' + PORT);
  })
});