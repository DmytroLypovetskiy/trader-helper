const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const ObjectId = require('mongodb').ObjectID;

const {
  check,
  validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');

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
    check('price', 'Date is required')
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

    const newTransaction = {
      user: req.user.id,
      symbol,
      qty,
      date,
      price,
      type: 'buy'
    }

    try {
      // Create transaction
      const transaction = new Transaction(newTransaction);

      await transaction.save();

      // Added transaction to user profile to keep track active stock qty
      let profile = await Profile.findOne({
        user: req.user.id
      });

      if (!profile) {
        return res.status(404).json({
          msg: 'profile not found'
        });
      }

      const transactionProps = {
        qty,
        price,
        purchaseId: transaction._id,
        sellIds: []
      }

      if (!profile.stocks) {
        profile.stocks = {};
      }

      if (profile.stocks[symbol]) {
        profile = await Profile.findOneAndUpdate({
          user: req.user.id
        }, {
          $push: {
            [`stocks.${symbol}`]: transactionProps
          }
        });
      } else {
        profile = await Profile.findOneAndUpdate({
          user: req.user.id
        }, {
          $set: {
            [`stocks.${symbol}`]: [transactionProps]
          }
        }, {
          new: true
        });
      }

      await profile.save();

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
    };

    const {
      symbol,
      qty,
      date,
      price
    } = req.body;

    const newTransaction = {
      user: req.user.id,
      symbol,
      qty,
      date,
      price,
      type: 'sell'
    }

    try {
      // Get original purchased transaction
      const origTransaction = await Transaction.findById(req.params.id);

      // Check user
      if (origTransaction.user.toString() !== req.user.id) {
        return res.status(401).json({
          msg: 'User not authorized'
        });
      }

      const transaction = new Transaction({
        ...newTransaction,
        transactionRef: [req.params.id]
      });

      await transaction.save();

      origTransaction.transactionRef.push(transaction._id);

      await origTransaction.save();

      let profile = await Profile.findOne({
        user: req.user.id
      });

      if (!profile) {
        return res.status(404).json({
          msg: 'profile not found'
        });
      }

      if (profile.stocks[symbol]) {
        profile = await Profile.findOneAndUpdate({
          [`stocks.${symbol}.purchaseId`]: ObjectId(req.params.id)
        }, {
          $push: {
            [`stocks.${symbol}.$.sellIds`]: transaction._id
          }
        });
      }

      await profile.save();

      res.json(transaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/transactions/:id
// @desc    Delete transaction
// @access  Private
/*
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        msg: 'Transaction not found'
      });
    }

    // Check user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not authorized'
      });
    }

    await transaction.remove();

    res.json({
      msg: 'Transaction removed'
    });
  } catch (error) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Transaction not found'
      });
    }
    res.status(500).send('Server Error');
  }
});
*/

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