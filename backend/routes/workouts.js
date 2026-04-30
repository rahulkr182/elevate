const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

// @route   GET api/workouts
// @desc    Get all user's workouts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/workouts
// @desc    Add new workout
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, sets, reps, weight, date } = req.body;

  try {
    const newWorkout = new Workout({
      name,
      sets,
      reps,
      weight,
      date: date ? new Date(date) : Date.now(),
      user: req.user.id
    });

    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
