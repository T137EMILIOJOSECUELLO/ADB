const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const saltRounds = 10; // Number of salt rounds for bcrypt

// Configure Express to parse JSON and URL-encoded body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB (replace 'mongodb://localhost:27017/your-database-name' with your database URI)
mongoose.connect('mongodb://127.0.0.1:27017/BloggingPlatform', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define a User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  contactInfo: String,
});

// Create a User model based on the schema
const User = mongoose.model('User', userSchema);

// Serve static files (HTML, CSS, etc.)
app.use(express.static('public'));

// Define a route to serve the registration form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/registration.html');
});

// Handle user registration
app.post('/register', async (req, res) => {
  try {
    // Hash and salt the password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contactInfo: req.body.contactInfo,
    });

    // Save the user to the database
    await newUser.save();
    res.send('Registration successful!');

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during registration.');
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
