const mongoose = require('mongoose');

const TAGS = ['Math', 'CS', 'Physics', 'Chemistry', 'Other'];

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 150, trim: true },
  body: { type: String, required: true, maxlength: 3000 },
  tag: { type: String, required: true, enum: TAGS },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bestAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null },
  createdAt: { type: Date, default: Date.now }
});

questionSchema.statics.TAGS = TAGS;

module.exports = mongoose.model('Question', questionSchema);