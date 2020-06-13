const express = require('express');
const router = express.Router();

const {
  check,
  validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');

const Stock = require('../../models/Stock');

// @route   GET api/stocks
// @desc    Get user stocks
// @access  Private
router.get(
  '/',
  auth,
  async (req, res) => {
    try {
      const stocks = await Stock.find({
        user: req.user.id
      }).sort({
        date: -1
      });

      res.json(stocks);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/stocks/:id
// @desc    Get user stock by id
// @access  Private
router.get(
  '/:id',
  auth,
  async (req, res) => {
    try {
      const stock = await Stock.findById(req.params.id);

      res.json(stock);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;