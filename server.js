var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];


app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('Todo API ROOT');
})

//GET /todos?completed=true
app.get('/todos', function(req, res){
  var queryParams = req.query
  var filteredTodos = todos;

  // if has property && completed === true
  // filtered to do = _.where(filteredtodo, ?)
  //else if has prop && completed if false

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
    filteredTodos = _.where(filteredTodos, { completed: true});
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
    filteredTodos = _.where(filteredTodos, {completed: false});
  }


  res.json(filteredTodos); 
});

//GET /todos/:id
app.get('/todos/:id', function(req, res){
  var todoId = req.params.id
  var matchedTodo = _.findWhere(todos, {id: todoId}); //where is part of underscore library

  if (matchedTodo){
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }

  // res.status(404).send();
  // res.send('Asking for a todo with id of ' + req.params.id);
});

//POST /todos
app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed'); //req.body;
  // console.log("description: " + body.description);

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }

  // set body.description to be trimmed value
  body.description = body.description.trim();

  // add id field
  body.id = todoNextId++;

  // push body into array
  todos.push(body);
  
  res.json(body);
});

//Delete /todos/:id
app.delete('/todos/:id', function(req, res){ //use _.without
  var toDoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: toDoId}); //todos[toDoId];

  if (matchedTodo){
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo); //res.json is same as res.send but sends json back
  } else {
    res.status(404).json({"error": "no todo found with that id"});
  }

});

// Put /todos/:id
app.put('/todos/:id', function(req, res){
  var body = _.pick(req.body, 'description', 'completed'); //req.body;
  var validAttributes = {};

  var toDoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: toDoId}); //todos[toDoId];

  if (!matchedTodo){
    return res.status(404).send();
  }

  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')){
    return res.status(400).send();
  }

  if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')){
    return res.status(404).send();
  }

  _.extend(matchedTodo, validAttributes);
  //objects is JS are passed by reference
  res.json(matchedTodo);

});

app.listen(PORT, function(){
  console.log('Express listening on port: ' + PORT);
})