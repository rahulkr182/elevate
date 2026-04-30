const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Meal = require('../models/Meal');

// @route   GET api/meals
// @desc    Get all user's meals
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/meals
// @desc    Add new meal
// @access  Private
router.post('/', auth, async (req, res) => {
  const { food, calories, protein, date } = req.body;

  try {
    const newMeal = new Meal({
      food,
      calories,
      protein,
      date: date ? new Date(date) : Date.now(),
      user: req.user.id
    });

    const meal = await newMeal.save();
    res.json(meal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
