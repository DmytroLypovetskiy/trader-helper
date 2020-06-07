const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

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
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const user = await User.findById(req.user.id).select('-password');
      const {
        symbol,
        qty,
        date,
        price
      } = req.body;
      const transaction = new Transaction({
        user: user._id,
        symbol,
        qty,
        date,
        price,
        type: 'buy'
      });

      const profile = await Profile.findOne({
        user: req.user.id
      });

      profile.stocks.push({
        symbol,
        qty,
        transactionId: transaction._id
      })

      await transaction.save();
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
    check('price', 'Date is required')
    .not()
    .isEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      };

      // Check user
      const origTransaction = await Transaction.findById(req.params.id);
      if (origTransaction.user.toString() !== req.user.id) {
        return res.status(401).json({
          msg: 'User not authorized'
        });
      }

      const user = await User.findById(req.user.id).select('-password');
      const {
        symbol,
        qty,
        date,
        price
      } = req.body;
      const transaction = new Transaction({
        user: user._id,
        symbol,
        qty,
        date,
        price,
        type: 'sell',
        transactionRef: [origTransaction._id]
      });

      origTransaction.transactionRef.push(transaction._id);

      const profile = await Profile.findOne({
        user: req.user.id
      });

      await origTransaction.save();
      await transaction.save();
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