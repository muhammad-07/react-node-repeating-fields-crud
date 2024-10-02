const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Database = require("./db");
// const authRoutes = require('./auth'); 
const User = require('./model/userModel');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const RepeatingFields = require('./model/repeatingFields');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;


const JWT_SECRET = "your_jwt_secret_key"; 

// // Middleware
app.use(cors());
app.use(bodyParser.json());

const connectionString = process.env.connectionString;

Database.connect(connectionString);

module.exports = app;

app.get("/", (req, res) => {
    res.send("Hello Node");
 });

// For single entry
//  app.post('/api/form', async (req, res) => {
//   try {
//     const formData = req.body;
//     const newForm = new RepeatingFields(formData);
//     await newForm.save();
//     res.status(201).json(newForm);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.post('/api/form', async (req, res) => {
//   try {
//     const formFields = req.body.formFields; // Array of form entries

//     // Insert multiple records into the database
//     const newForms = await RepeatingFields.insertMany(formFields);

//     res.status(201).json(newForms); // Return the inserted documents
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });


app.post('/api/form', authMiddleware, async (req, res) => {
  try {
    const formFields = req.body.formFields;

    // Add the user's ID to each form entry
    const formsWithUser = formFields.map(field => ({
      name: field.name,
      city: field.city,
      userId: req.user.userId // Add the userId from the token
    }));

    // Insert the forms into the database
    const newForms = await Form.insertMany(formsWithUser);
    res.status(201).json(newForms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/forms', authMiddleware, async (req, res) => {
  try {
    // Find forms by the authenticated user's ID
    const userForms = await Form.find({ userId: req.user.userId });
    res.json(userForms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });