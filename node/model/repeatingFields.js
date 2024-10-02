const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Link to user
});

const RepeatingFields = mongoose.model('RepeatingFields', formSchema, 'RepeatingFields');

module.exports = RepeatingFields;


