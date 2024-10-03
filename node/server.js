const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Database = require("./db");
// const authRoutes = require('./auth'); 
const nodemailer = require('nodemailer');
const User = require('./model/userModel');
const multer = require('multer'); // for file upload
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
    res.send("Hello World");
 });

 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

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
    const newForms = await RepeatingFields.insertMany(formsWithUser);
    res.status(201).json(newForms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// app.get('/api/forms', authMiddleware, async (req, res) => {
//   try {
//     // Find forms by the authenticated user's ID
//     const userForms = await RepeatingFields.find({ userId: req.user.userId });
//     res.json(userForms);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
app.post('/api/forms', authMiddleware, async (req, res) => {
  try {
    const { name, city } = req.body; // Accept search filters from the request body

    // Build the search query dynamically based on provided filters
    let searchQuery = { userId: req.user.userId };
    if (name) searchQuery.name = name;
    if (city) searchQuery.city = city;

    // Find forms by the authenticated user's ID and any filters
    const userForms = await RepeatingFields.find(searchQuery);
    res.json(userForms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.put('/api/form/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city } = req.body;
    
    const updatedForm = await RepeatingFields.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { name, city },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/form/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedForm = await RepeatingFields.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const newUser = new User({ username, password });
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
    
//   } catch (error) 
//   {
//     if (error.code === 11000 && error.keyValue && error.keyValue.username) {
//       return res.status(400).json({ error: 'This username is already taken' });
//     }
//     res.status(400).json({ error: error.message });
//   }
// });
app.post('/api/auth/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null; // If file exists, save its path

    const newUser = new User({ username, password, email, profilePicture });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {

      return res.status(400).json({ error: 'Username or Email already taken' });
    }
    res.status(400).json({ error: error.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
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


const RESET_TOKEN_SECRET = "your_reset_token_secret_key"; // Secret for reset tokens

// Nodemailer setup (for sending emails)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.emailUser, // Replace with your email
    pass: process.env.emailPassword  // Replace with your email password
  }
});

// Forgot Password Request
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign({ userId: user._id }, RESET_TOKEN_SECRET, { expiresIn: '1h' });

    // Create reset password link (e.g., http://localhost:3000/reset-password/token)
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Send reset email
    await transporter.sendMail({
      from: process.env.emailUser,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Please click on the following link to reset your password: ${resetLink}`
    });

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset Password
app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate the token
    const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    // Hash and update the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});


app.use("/uploads",express.static('uploads')); // To allow static files from the 'uploads' folder
app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the user ID from the token (set by your auth middleware)
    const user = await User.findById(userId).select('username email profilePicture'); // Select only the fields you need
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user); // Send the user data as a response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });