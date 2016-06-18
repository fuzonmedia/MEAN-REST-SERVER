var express = require('express');
var passport	= require('passport');
// pass passport for configuration
require('../config/passport')(passport);
module.exports = function(app, route ) {
// bundle our routes
var apiRoutes = express.Router();

// create a new user account (POST http://localhost:8080/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new app.models.User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

// connect the api routes under /*
app.use('/', apiRoutes);
// Return middleware.
return function(req, res, next) {
  next();
};
};
