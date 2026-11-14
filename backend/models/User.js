// User.js - Patron account schema for MongoDB
// Handles: id, name, email, password, role, timestamps

const userSchema = {
  id:        { type: String, required: true, unique: true },
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, default: 'patron', enum: ['patron', 'admin'] },
  createdAt: { type: Date, default: Date.now }
};

module.exports = userSchema;
