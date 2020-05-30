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

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    // Build profile object
    const profileFields = {
      user: req.user.id
    };

    try {
      let profile = await Profile.findOne({
        user: req.user.id
      });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate({
          user: req.user.id
        }, {
          $set: profileFields
        }, {
          new: true
        });

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/profile/stocks
// @desc    Add profile stocks
// @access  Private
router.put(
  '/stocks',
  auth,
  [
    check('symbol', 'Symbol is required')
    .not()
    .isEmpty(),
    check('title', 'Title is required')
    .not()
    .isEmpty(),
    check('date', 'Date is required')
    .not()
    .isEmpty(),
    check('boughtFor', 'Bought date is required')
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
        symbol,
        title,
        date,
        boughtFor
      } = req.body;

      const newExp = {
        symbol,
        title,
        date,
        boughtFor
      };

      const profile = await Profile.findOne({
        user: req.user.id
      });

      profile.stocks.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;