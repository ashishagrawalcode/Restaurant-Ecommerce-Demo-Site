// Review.js - MongoDB schema for Customer Reviews
// khush task: Ratings & Reviews

const reviewSchema = {
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dish: { type: String, default: 'General Dining' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
};

module.exports = reviewSchema;
