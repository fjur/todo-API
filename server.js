var express = require('express');
var bodyParser = require('body-parser');
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
  todos.forEach(function(todo){
    if(todo.id == todoId)
      res.json(todo);
  })
  res.status(404).send();
  // res.send('Asking for a todo with id of ' + req.params.id);
});

//POST /todos
app.post('/todos', function (req, res) {
  var body = req.body;
  // console.log("description: " + body.description);

  // add id field
  body.id = todoNextId++;

  // push body into array
  todos.push(body);
  
  res.json(body);
});

app.listen(PORT, function(){
  console.log('Express listening on port: ' + PORT);
})