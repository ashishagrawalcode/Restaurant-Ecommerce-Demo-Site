// reviewRoutes.js - Customer Reviews, Ratings & Testimonials Module
// Assigned to: Khush Raghav
// Goal: Allow diners to submit feedback and dynamically display customer reviews on the website.

module.exports = {
  handle(req, res, pathname, method, body, helpers) {
    const { readJson, writeJson, sendJson, isConnected, getModels } = helpers;

    // 1. GET /api/reviews/list - fetch all customer reviews
    if (pathname === '/api/reviews/list' && method === 'GET') {
      const reviews = readJson('reviews.json');
      return sendJson(res, 200, Array.isArray(reviews) ? reviews : []);
    }

    // 2. POST /api/reviews/new - add a new customer review
    if (pathname === '/api/reviews/new' && method === 'POST') {
      const reviews = readJson('reviews.json') || [];
      const { name, dish, rating, comment } = body;

      // Calculate the next ID (e.g., rev-101, rev-102, rev-105)
      let maxNum = 100;
      reviews.forEach(r => {
        if (r && r.id && typeof r.id === 'string') {
          const match = r.id.match(/^rev-(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });
      const newId = `rev-${maxNum + 1}`;

      const newReview = {
        id: newId,
        name: (name && String(name).trim()) ? String(name).trim() : 'Patron',
        dish: (dish && String(dish).trim()) ? String(dish).trim() : 'General Dining',
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        comment: (comment && String(comment).trim()) ? String(comment).trim() : 'A memorable dining experience.',
        date: new Date().toISOString()
      };

      // Prepend to array and persist to backend/data/reviews.json
      reviews.unshift(newReview);
      writeJson('reviews.json', reviews);

      // Optionally sync to MongoDB if connected
      if (isConnected && isConnected()) {
        const models = getModels ? getModels() : {};
        if (models.Review) {
          models.Review.create({
            id: newReview.id,
            name: newReview.name,
            dish: newReview.dish,
            rating: newReview.rating,
            comment: newReview.comment,
            createdAt: new Date(newReview.date)
          }).catch(err => {
            console.error('Error saving review to MongoDB:', err.message);
          });
        }
      }

      return sendJson(res, 201, {
        success: true,
        message: 'Review added successfully',
        review: newReview
      });
    }

    sendJson(res, 404, { error: 'Review route not found' });
  }
};
