/**
 * @file User.js
 * @description Mongoose schema definition for Patron & Staff User Accounts.
 * Manages identity, email credentials, role-based authorization, and timestamps.
 */

/**
 * User account schema definition.
 * @typedef {Object} UserDefinition
 * @property {string} id - Unique user identifier.
 * @property {string} name - User's full name.
 * @property {string} email - Unique lowercase user email address.
 * @property {string} password - User password hash.
 * @property {'patron'|'admin'} role - Role tier for access control.
 * @property {Date} createdAt - Registration date timestamp.
 */
const userSchema = {
  id:        { type: String, required: true, unique: true },
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, default: 'patron', enum: ['patron', 'admin'] },
  createdAt: { type: Date, default: Date.now }
};

module.exports = userSchema;
