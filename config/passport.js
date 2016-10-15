var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt        = require('jwt-simple');

// load up the user model
var User = require('../models/user');

module.exports = function(passport,app) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.passReqToCallback=true;
  opts.secretOrKey = process.env.secret;
  passport.use(new JwtStrategy(opts, function(req,user, done) {
  var token = getToken(req.headers);

  // Check token available in redis sets , if yes give access
  app.RedisClient.sismember(process.env.redis_setsToken,token,function(err, reply) {
  if(err) {
    console.log("redis Error read set");
  }
  else {
    if(reply)
    {
      //console.log('have key in redis');
      done(null, user);
    }
    else {
        User.findOne({_id: user._id}, function(err, user) {
              if (err) {
                  return done(err, false);
              }
              if (user) {
                var token = jwt.encode(user, process.env.secret);

                // Store token in redis server
                app.RedisClient.sadd(process.env.redis_setsToken,token);
                //console.log("Token added in redis");
                  done(null, user);
              } else {
                  done(null, false);
              }
          });
      }

  }

});

  }));
};
