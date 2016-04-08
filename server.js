var express = require('express');
app = express();
var PORT = process.env.PORT || 3000;
var todos = [
  { id: 1,
    description: 'Meed mom for Lunch',
    completed: false
  },
  { id: 2,
    description: 'Go to market',
    completed: false
  },{ id: 3,
    description: 'walk trix',
    completed: true
  }
];

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

app.listen(PORT, function(){
  console.log('Express listening on port: ' + PORT);
})