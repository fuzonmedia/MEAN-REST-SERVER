var Resource = require('resourcejs');
module.exports = function(app, route) {

  // Setup the controller for REST;
  Resource(app, '', route, app.models.movie)
  .index({
  before: function(req, res, next) {
    req.modelQuery = this.model.where({ uid: 'abc' });
    next();
  }
  })
  .get()
  .put()
  .post()
  .delete();

  // Return middleware.
  return function(req, res, next) {
    next();
  };
};
