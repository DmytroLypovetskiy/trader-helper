const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  symbol: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'transaction'
  }
});

module.exports = mongoose.model('stock', StockSchema);