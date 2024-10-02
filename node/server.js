const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Database = require("./db");
const cors = require('cors');
const RepeatingFields = require('./model/repeatingFields');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

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

app.post('/api/form', async (req, res) => {
  try {
    const formFields = req.body.formFields; // Array of form entries

    // Insert multiple records into the database
    const newForms = await RepeatingFields.insertMany(formFields);

    res.status(201).json(newForms); // Return the inserted documents
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });