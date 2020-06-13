const express = require('express');
const router = express.Router();

const {
  check,
  validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');

const Transaction = require('../../models/Transaction');
const Stock = require('../../models/Stock');

// @route   GET api/transactions
// @desc    Get user transactions
// @access  Private
router.get(
  '/',
  auth,
  async (req, res) => {
    try {
      const transactions = await Transaction.find({
        user: req.user.id
      }).sort({
        date: -1
      });

      res.json(transactions);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/transactions/:id
// @desc    Get user transaction by id
// @access  Private
router.get(
  '/:id',
  auth,
  async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id);

      res.json(transaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/transactions/buy
// @desc    Add transaction Buy
// @access  Private
router.post(
  '/buy',
  auth,
  [
    check('symbol', 'Symbol is required')
    .not()
    .isEmpty(),
    check('qty', 'Quantity is required')
    .not()
    .isEmpty(),
    check('date', 'Date is required')
    .not()
    .isEmpty(),
    check('price', 'Price is required')
    .not()
    .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      symbol,
      qty,
      date,
      price
    } = req.body;

    try {
      const stockData = {
        user: req.user.id,
        symbol,
        qty,
        price
      }

      // Create Transaction record
      const transaction = new Transaction({
        ...stockData,
        date,
        type: 'buy'
      });

      await transaction.save();

      // Create Stock record
      const stock = new Stock({
        ...stockData,
        transaction: transaction._id,
      });

      await stock.save();

      res.json(transaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/transactions/sell/:id
// @desc    Add transaction Sell by id
// @access  Private
router.post(
  '/sell/:id',
  auth,
  [
    check('symbol', 'Symbol is required')
    .not()
    .isEmpty(),
    check('qty', 'Quantity is required')
    .not()
    .isEmpty(),
    /*
    check('date', 'Date is required')
    .not()
    .isEmpty(),
    */
    check('price', 'Price is required')
    .not()
    .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    };

    const {
      symbol,
      qty,
      //date,
      price
    } = req.body;

    try {
      const stockData = {
        user: req.user.id,
        symbol,
        qty,
        price
      }

      // Update Stock record
      let stock = await Stock.findOne({
        transaction: req.params.id
      });

      if (stock && stock.qty >= qty) {
        const transaction = new Transaction({
          ...stockData,
          date: Date.now(),
          type: 'sell'
        });

        await transaction.save();

        const newQty = stock.qty - qty;

        if (newQty > 0) {
          stock = await Stock.findOneAndUpdate({
            transaction: req.params.id
          }, {
            qty: newQty
          });

          await stock.save();

        } else {
          stock = await Stock.findOneAndDelete({
            transaction: req.params.id
          }, (err) => {
            if (err) console.error(err);
          });

          //res.status(204);
        }

        res.json(transaction);
      } else {
        if (!stock) {
          res.status(500).send('Stock not found');
        } else {
          res.status(500).send('Do not have this amount');
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/watchlist/:stocks_id
// @desc    Delete stock from watchlist
// @access  Private
router.delete('/watchlist/:stocks_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });

    // Get remove index
    const removeIndex = profile.watchlist
      .map((item) => item.id)
      .indexOf(req.params.stocks_id);

    profile.watchlist.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;