//load settings / config db settings .env file
require('dotenv').config();

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

// Set server port . require for deployment

var port        = process.env.PORT || 8080;

// Auth passport
var morgan      = require('morgan');
var passport	= require('passport');
var jwt         = require('jwt-simple');

// Create the application.
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// CORS Support . Cross domain accessablity
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.database);
mongoose.connection.once('open', function() {

  // Load the models.
  app.models = require('./models/index');

  // Load the routes.
  var routes = require('./routes');
  _.each(routes, function(controller, route) {
    app.use(route, controller(app, route));
  });

  console.log('Listening on port - ' + port);
  app.listen(port);
});
