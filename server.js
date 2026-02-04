// Import all required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import the voter model
const Voter = require('./models/Voter');

// Connect to MongoDB using the connection string from .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.log('❌ MongoDB connection failed:', err));

// 🧩 Route 1: Handle voter registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, nationalId, password } = req.body;

    // Create a new voter record
    const newVoter = new Voter({
      name,
      email,
      nationalId,
      password
    });

    // Save voter to database
    await newVoter.save();
    res.status(200).json({ message: 'Voter registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 🧩 Route 2: Fetch all registered voters (for members page)
app.get('/api/users', async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json(voters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching registered voters' });
  }
});

// Set port number
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
