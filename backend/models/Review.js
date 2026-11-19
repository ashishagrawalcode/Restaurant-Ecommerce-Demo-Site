/**
 * @file Review.js
 * @description Mongoose schema definition for Customer Reviews & Ratings.
 * Defines structure, data types, constraints, and timestamps for culinary feedback.
 */

/**
 * Customer review and rating schema definition.
 * @typedef {Object} ReviewDefinition
 * @property {string} id - Unique review UUID or timestamp-based identifier.
 * @property {string} name - Reviewer or customer display name.
 * @property {string} dish - Specific menu item or dining experience referenced.
 * @property {number} rating - Numerical score from 1 (lowest) to 5 (highest).
 * @property {string} comment - Detailed customer testimonial or feedback.
 * @property {Date} createdAt - Timestamp when the review was created.
 */
const reviewSchema = {
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dish: { type: String, default: 'General Dining' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
};

module.exports = reviewSchema;
