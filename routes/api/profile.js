const express = require('express');
const router = express.Router();
const request = require('request');
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

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });

    if (!profile) {
      return res.status(400).json({
        msg: 'There is no profile for this user'
      });
    }

    res.json(profile.populate('user', ['name', 'logo']));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/stocks/:stocks_id
// @desc    Delete stock from profile
// @access  Private
router.delete('/stocks/:stocks_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });

    // Get remove index
    const removeIndex = profile.stocks
      .map((item) => item.id)
      .indexOf(req.params.stocks_id);

    profile.stocks.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route   PUT api/profile/watchlist
// @desc    Add stock to watchlist
// @access  Private
router.put(
  '/watchlist',
  auth,
  [
    check('symbol', 'Symbol is required')
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

      const {
        symbol
      } = req.body;
      const newExp = {
        symbol
      };

      const profile = await Profile.findOne({
        user: req.user.id
      });

      profile.watchlist.unshift(newExp);

      await profile.save();

      res.json(profile);
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