const express = require('express');

let app = express();

const PORT = process.env.PORT || 1111;

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
})

app.get('/map', function (req, res) {
  res.sendfile(__dirname + '/map.html');
})

app.get('/login', function (req, res) {
  res.sendfile(__dirname + '/login.html');
})

app.get('/signup', function (req, res) {
  res.sendfile(__dirname + '/signup.html');
})

app.get('/aboutUs', function (req, res) {
  res.sendfile(__dirname + '/aboutUs.html');
})

app.listen(PORT, function(){
  console.log('express server is up on port' + PORT )
})