const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
//const request = require('request');
const cors = require('cors')

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({
  extended: false
}));
app.use(cors());

app.use("/api/auth", require("./routes/api/auth")); // User autorization
app.use("/api/user", require("./routes/api/user")); // User validation
app.use("/api/profile", require("./routes/api/profile")); // User profile
app.use("/api/transactions", require("./routes/api/transactions")); // User transactions
app.use("/api/stocks", require("./routes/api/stocks")); // User stocks

app.get("/", (req, res) => {
  /*
  try {
    request('https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2020-04-30&to=2020-05-01&token=br8k8g7rh5ral083hgd0', {
      json: true
    }, (err, response, body) => {
      if (err) {
        return console.log(err);
      }

      res.json(body)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  */

  /*
  request('https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=br8k8g7rh5ral083hgd0', {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
  });
  */

  //return res.send("API is Running")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));