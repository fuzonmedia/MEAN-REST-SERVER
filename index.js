//load settings / config db settings .env file
require('dotenv').config();
var favicon = require('serve-favicon');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');
//template engine
var expressLayouts = require('express-ejs-layouts');
require('./assets/functions');
// Set server port . require for deployment

var port        = process.env.PORT || 8080;

// redis settings

var redis = require("redis");

// Auth passport
var morgan      = require('morgan');
var passport	= require('passport');
var jwt         = require('jwt-simple');

// Create the application.
var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));


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
  res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization');
  next();
});

// Redis Connect

// For Local redis server
//var RedisClient = redis.createClient(6379,process.env.REDISCLOUD_URL || "127.0.0.1");
// For redis cloud lab (Via heroku)
var RedisClient = redis.createClient(process.env.REDISCLOUD_URL || "127.0.0.1", {no_ready_check: true});
RedisClient.on("error", function (err) {
    console.log("Redis Error " + err);
});

RedisClient.on('connect', function() {
    console.log('Connected to Redis server');
    app.RedisClient=RedisClient;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.database);
mongoose.connection.once('open', function() {
console.log("Connected with mongoDB");

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
});
