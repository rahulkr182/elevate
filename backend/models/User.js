const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  calorieGoal: {
    type: Number,
    default: 2000
  },
  proteinGoal: {
    type: Number,
    default: 150
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
