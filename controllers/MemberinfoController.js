var express = require('express');
var passport	= require('passport');
var jwt        = require('jwt-simple');

// pass passport for configuration
require('../config/passport')(passport);
module.exports = function(app, route) {
// bundle our routes
var apiRoutes = express.Router();

// route to a restricted info (GET http://localhost:8080/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, process.env.secret);
    app.models.User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
// connect the api routes under /*
app.use('/', apiRoutes);
// Return middleware.
return function(req, res, next) {
  next();
};
};
