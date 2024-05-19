  // models/List.js

  const mongoose = require('mongoose');

  const listSchema = new mongoose.Schema({
    title: { type: String, required: true },
    customProperties: [{
      title: { type: String, required: true },
      defaultValue: { type: String, required: true }
    }]
  });

  const List = mongoose.model('List', listSchema);
  module.exports = List;