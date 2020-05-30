const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  },
  stocks: [{
    symbol: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true
    },
    boughtFor: {
      type: Number,
      required: true
    }
  }],
  watchlist: [{
    symbol: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
  }]
});

module.exports = mongoose.model('profile', ProfileSchema);