const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  watchlist: [{
    symbol: {
      type: String,
      required: true
    }
  }],
  news: [{
    symbol: {
      type: String,
      required: true
    }
  }]
});

module.exports = mongoose.model('profile', ProfileSchema);