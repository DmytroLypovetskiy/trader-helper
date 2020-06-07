const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  stocks: [{
    _id: false,
    symbol: {
      type: String
    },
    qty: {
      type: Number
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transactions'
    }
  }],
  watchlist: [{
    symbol: {
      type: String,
      required: true
    }
  }]
});

module.exports = mongoose.model('profile', ProfileSchema);