const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

app.use(express.json()); // Parse JSON request bodies

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with the origin of your React app
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

mongoose
  .connect('mongodb://localhost/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

// Create a User model/schema (assuming you have a User model)
const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  accountType: String,
  age: String,
  referrer: String,
  bio: String,
});

// Registration endpoint
app.post('/api/register', (req, res) => {
  // Extract user data from request body
  const { firstName, lastName, email, password, accountType, age, bio } = req.body;

  // Validate the required fields
  if (!firstName || !lastName || !email || !password || !accountType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create a new user object
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    accountType,
    age,
    bio,
  });
  // Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  
    // Find the user by email and password
    User.findOne({ email, password })
      .then((user) => {
        if (!user) {
          // User not found or invalid credentials
          return res.status(401).json({ error: 'Invalid email or password' });
        }
  
        // User found, login successful
        res.status(200).json({ message: 'Login successful' });
      })
      .catch((error) => {
        console.error('Error logging in user', error);
        res.status(500).json({ error: 'An error occurred' });
      });
  });
  

  // Save the user to the database
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: 'User registered successfully' });
    })
    .catch((error) => {
      console.error('Error registering user', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Retrieve all users endpoint
app.get('/api/users', (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.error('Error getting users', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});