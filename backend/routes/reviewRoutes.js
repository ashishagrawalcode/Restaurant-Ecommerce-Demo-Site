// reviewRoutes.js - Patron Reviews & Ratings Module
// Assigned to: Khush Raghav
// Task: Allow customers to submit reviews and fetch top ratings for dishes

module.exports = {
  handle(req, res, pathname, method, body, helpers) {
    const { readJson, writeJson, sendJson } = helpers;

    // GET /api/reviews/list - fetch all customer reviews
    if (pathname === '/api/reviews/list' && method === 'GET') {
      const reviews = readJson('reviews.json');
      return sendJson(res, 200, reviews);
    }

    // POST /api/reviews/new - add a new review
    if (pathname === '/api/reviews/new' && method === 'POST') {
      const reviews = readJson('reviews.json');
      const { name, dish, rating, comment } = body;

      const newReview = {
        id: 'rev-' + Date.now().toString().slice(-5),
        name: name || 'Patron',
        dish: dish || 'General Dining',
        rating: Number(rating) || 5,
        comment: comment || 'Wonderful experience',
        date: new Date().toISOString()
      };

      reviews.unshift(newReview);
      writeJson('reviews.json', reviews);

      return sendJson(res, 201, { success: true, message: 'Review added', review: newReview });
    }

    sendJson(res, 404, { error: 'Review route not found' });
  }
};
