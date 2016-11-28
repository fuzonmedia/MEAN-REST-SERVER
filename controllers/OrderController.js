var express = require('express');
var passport	= require('passport');
var jwt        = require('jwt-simple');


module.exports = function(app, route) {
// pass passport for configuration
require('../config/passport')(passport,app);
// bundle our routes
var apiRoutes = express.Router();

// route to a restricted info (GET http://localhost:8080/order) (Get List of All orders associate with authenticated user )
apiRoutes.get('/order', passport.authenticate('jwt', { session: false}), function(req, res) {
    app.models.Order.find({
      userID: req.user._id
    }, {userID:0}, function(err, data) {
        if (err) return res.status(200).send({success: false, msg: 'Error request' , error: err});

        if (!data) {
          return res.status(200).send({success: false, msg: 'Details Not found'});
        } else {
          return res.status(200).send({success: true, msg: 'Orders Listing ', result: data});
        }
    });
});

// route to a restricted info (POST http://localhost:8080/order) (Create Order for authenticated user)
apiRoutes.post('/order', passport.authenticate('jwt', { session: false}), function(req, res) {
    if(req.body)
    {
    var neworder = new app.models.Order({
      OrderID: req.body.OrderID,
      customerName: req.body.customerName,
      amount: req.body.amount,
      userID: req.user._id
    });

    // save the Order
    neworder.save(function(err) {
      if (err) {
        return res.status(200).send({success: false, msg: 'Invalid request' , error : err});
      }
      return res.status(200).send({success: true, msg: 'Successfully created new order.'});
    });
  }
  else {
    return res.status(200).send({success: false, msg: 'Request Null'});
  }

});

// route to a restricted info (GET http://localhost:8080/order/:id) (Get Single  Order for authenticated user by order ID )
apiRoutes.get('/order/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    app.models.Order.findOne({
      _id: req.params.id,
      userID: req.user._id
    }, {userID:0}, function(err, data) {
        if (err) return res.status(200).send({success: false, msg: 'Invalid request '});

        if (!data) {
          return res.status(200).send({success: false, msg: 'Details Not found'});
        } else {
          return res.status(200).send({success: true, msg: 'Order Details', result: data});
        }
    });

});

// route to a restricted info (PUT http://localhost:8080/order/:id) (Update  Single  Order for authenticated user by order ID )
apiRoutes.put('/order/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    if(req.body)
    {
    app.models.Order.findOneAndUpdate({
      _id: req.params.id,
      userID: req.user._id
    }, {$set:req.body}, {new: true,fields: {userID:0} ,runValidators: true}, function(err,newvalue) {
        //console.log(newvalue);
        if (err) return res.status(200).send({success: false, msg: 'Invalid request'});

        if (!newvalue) {
          return res.status(200).send({success: false, msg: 'Details not found'});
        } else {
          return res.status(200).send({success: true, msg: 'Order Details Updated', result: newvalue});
        }
    });
  }
  else {
    return res.status(200).send({success: false, msg: 'Request Null'});
  }
});

// route to a restricted info (DELETE http://localhost:8080/order/:id) (Delete  Single  Order for authenticated user by order ID )
apiRoutes.delete('/order/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    app.models.Order.findOneAndRemove({
      _id: req.params.id,
      userID: req.user._id
    } ,function(err, data) {
        if (err) return res.status(200).send({success: false, msg: 'Invalid request '});

        if (!data) {
          return res.status(200).send({success: false, msg: 'Details Not found'});
        } else {
          return res.status(200).send({success: true, msg: 'Order Deleted', result: data});
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
