var express = require('express');
var passport	= require('passport');
// pass passport for configuration
require('../config/passport')(passport);
module.exports = function(app, route ) {
// bundle our routes
var apiRoutes = express.Router();

// create a new user account (POST http://localhost:8080/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password || !req.body.name || !req.body.country) {
    res.json({success: false, msg: 'Please pass username , password , name , country '});
  } else {
    var newUser = new app.models.User({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      dob: req.body.dob,
      country: req.body.country,
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successfully created new user.'});
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
