var express = require('express');
var passport	= require('passport');
var jwt        = require('jwt-simple');



module.exports = function(app, route) {
// pass passport for configuration
require('../config/passport')(passport,app);
// bundle our routes
var apiRoutes = express.Router();

// create a new user account (POST http://localhost:8080/signup)
apiRoutes.post('/authenticate', function(req, res) {
  app.models.User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, process.env.secret);

          // Store token in redis server
          app.RedisClient.sadd(process.env.redis_setsToken,token);
          //console.log("Token Added in redis");

          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});
// connect the api routes under /*
app.use('/', apiRoutes);
// Return middleware.
return function(req, res, next) {
  next();
};
};
