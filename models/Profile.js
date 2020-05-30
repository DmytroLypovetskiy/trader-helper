const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user
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
    bougthFor: {
      type: Number,
    },
    soldFor: {
      type: Number,
      required: true,
    }
  }],
  watchlist: [{
    symbol: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    }
  }]
});

module.exports = mongoose.model('profile', ProfileSchema);