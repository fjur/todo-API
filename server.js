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

//GET /todos
app.get('/todos', function(req, res){
  res.json(todos); 
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

app.listen(PORT, function(){
  console.log('Express listening on port: ' + PORT);
})