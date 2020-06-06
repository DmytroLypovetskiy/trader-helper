const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  stocks: [

    /*
    {
    
      symbol: String, //GE 100 items 6 USD 
    states: [
      {  
        qty: Number // 100 -> 47
        buyId: 1, //100 items 200 
        sellIds: [
          sellId: 1, // 1 250, 2 300, 50 350
        ]
      },
      {
        symbol: String, //GE 100 items 6.5 USD 
        states: [
          {  
            qty: Number // 100
            buyId: 2, //100 items 200 
            sellIds: [
              sellId: 1, // 1 250, 2 300, 50 
            ]
          }
    ]}*/
    /*
    buy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transactions'
    },
    sell: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transactions'
    }]
    */
  ],
  watchlist: [{
    symbol: {
      type: String,
      required: true
    }
  }]
});

module.exports = mongoose.model('profile', ProfileSchema);