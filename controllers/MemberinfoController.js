var express = require('express');
var passport	= require('passport');
var jwt        = require('jwt-simple');


module.exports = function(app, route) {
  // pass passport for configuration
  require('../config/passport')(passport,app);
// bundle our routes
var apiRoutes = express.Router();

// route to a restricted info (GET http://localhost:8080/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
    // search for the unique usename & ignore password & objectID (users collections)
    app.models.User.findOne({
      username: req.user.username
    }, { password: 0, _id: 0 }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!', result: user});
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
