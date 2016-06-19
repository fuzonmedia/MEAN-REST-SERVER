var mongoose = require('mongoose');

// Create the MovieSchema.
var OrderSchema = new mongoose.Schema({
  OrderID: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  userID: {
    type: String,
    required: true
  }
});

// Export the model.
module.exports = mongoose.model('Order', OrderSchema);
