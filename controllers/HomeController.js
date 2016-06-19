var express = require('express');
module.exports = function(app, route ) {
// bundle our routes
var apiRoutes = express.Router();

// Index Page(GET http://localhost:8080/)
apiRoutes.get('/', function(req, res) {
res.render('home/index', { title: "Home | Application" , layout: "layout.ejs" });
});

// connect the api routes under /*
app.use('/', apiRoutes);
// Return middleware.
return function(req, res, next) {
  next();
};
};
