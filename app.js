'use strict';

// simple express server
var express = require('express');
var app = express();
var expressLayouts = require('express-ejs-layouts');

//enable https requests
app.enable("trust proxy")
//disables powered by express
app.disable('x-powered-by');

//views
app.use(expressLayouts);
app.set('views', process.cwd() + '/app');
app.set('view engine', 'ejs');

app.set('layout', 'index');

//server port
app.set('port', 3000);

//serve static files
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/assets/*', function(req, res) {
  console.log('aqui')
  res.sendFile('/', { root: './public/assets/' });
});

app.listen(app.get('port'), function(e) {
  var host = this.address().address;
  var port = this.address().port;
  console.log('Starting web server on http://%s:%s ', host, port);
})
