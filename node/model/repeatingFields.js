const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true }
});

const RepeatingFields = mongoose.model('RepeatingFields', formSchema, 'RepeatingFields');

module.exports = RepeatingFields;
