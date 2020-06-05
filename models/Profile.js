const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  stocks: [{
    buy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transactions'
    },
    sell: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transactions'
    }]
  }],
  watchlist: [{
    symbol: {
      type: String,
      required: true
    }
  }]
});

module.exports = mongoose.model('profile', ProfileSchema);