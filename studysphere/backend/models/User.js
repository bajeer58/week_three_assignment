const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.createUser = async function ({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return this.create({ name, email, passwordHash });
};

module.exports = mongoose.model('User', userSchema);