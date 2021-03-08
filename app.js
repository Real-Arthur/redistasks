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
  
  res.render('index', {
    title: title
  })
})

app.listen(3000);
console.log('Server running on port 30000');

module.exports = app;
