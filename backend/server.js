const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const mealRoutes = require('./routes/meals');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/ai', aiRoutes);

const { MongoMemoryServer } = require('mongodb-memory-server');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitness_tracker', {
      serverSelectionTimeoutMS: 2000
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Local MongoDB connection failed. Starting In-Memory MongoDB for testing...');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`Connected to In-Memory MongoDB at ${mongoUri}`);
  }
};

connectDB().then(() => {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
  });
});
