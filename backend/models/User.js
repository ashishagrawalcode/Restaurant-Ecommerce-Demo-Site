// User.js - MongoDB schema for Users
// shreya task: Authentication & Users

const userSchema = {
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'patron' },
  createdAt: { type: Date, default: Date.now }
};

module.exports = userSchema;
