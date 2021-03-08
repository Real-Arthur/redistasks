const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const redis = require('redis');

const app = express();

// Create client
const client = redis.createClient();

client.on('connect', function() {
  console.log('connected to reddis');
})
.on('error', function(err) {
  console.error(err);
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res) {
  const title = 'Task List';

  client.lrange('tasks', 0, -1, function(err, reply) {
    res.render('index', {
    title: title,
    tasks: reply
  })  
  });
})

app.post('/task/add', function(req, res){
  console.log('req', req.body);
  const task = req.body.task;
  client.rpush('tasks', task, function(err, reply){
    if(err){
      console.log(err);
    }
    console.log('Task Added');
    res.redirect('/')
  })
})

app.post('/task/delete', function(req, res){
  const tasksToDel = req.body.tasks;
  client.lrange('tasks', 0, -1, function(err, tasks){
    for(let i = 0; i < tasks.length; i++){
      if(tasksToDel.indexOf(tasks[i]) > -1){
        client.lrem('tasks', 0, tasks[i], function(){
          if(err){
            console.log(err);
          }
        });
      }
    }
    res.redirect('/')
  })
})

app.listen(3000);
console.log('Server running on port 30000');

module.exports = app;
