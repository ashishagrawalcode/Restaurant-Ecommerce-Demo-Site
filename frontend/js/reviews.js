/**
 * @file reviews.js
 * @description Customer Reviews, Ratings & Testimonials Client Controller.
 * Handles fetching customer reviews, dynamic DOM card rendering, star formatting,
 * and review submission modal interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const accoladesGrid = document.querySelector('.accolades-grid');
  if (!accoladesGrid) return;

  /**
   * Converts numerical rating into a star character representation.
   * @param {number|string} rating - Score between 1 and 5.
   * @returns {string} String of filled and empty stars (e.g. "★★★★★").
   */
  function formatStars(rating) {
    const r = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  /**
   * Constructs an accolade card DOM element for a review item.
   * @param {Object} review - Review record object.
   * @param {string} review.name - Author name.
   * @param {string} [review.dish] - Referenced dish.
   * @param {number} review.rating - Star score.
   * @param {string} review.comment - Review quotation text.
   * @returns {HTMLDivElement} Rendered card element.
   */
  function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'accolade-card';

    const stars = document.createElement('div');
    stars.className = 'accolade-stars';
    stars.textContent = formatStars(review.rating);

    const quote = document.createElement('blockquote');
    quote.textContent = `"${review.comment}"`;

    const author = document.createElement('span');
    author.className = 'accolade-author';
    const dishInfo = review.dish ? ` • ${review.dish}` : '';
    author.textContent = `— ${review.name}${dishInfo}`;

    card.appendChild(stars);
    card.appendChild(quote);
    card.appendChild(author);

    return card;
  }

  /**
   * Renders the collection of review cards into the accolades grid container.
   * Displays a friendly placeholder message if review list is empty.
   * @param {Array<Object>} reviews - Array of review objects.
   * @returns {void}
   */
  function renderReviews(reviews) {
    accoladesGrid.replaceChildren();
    if (!Array.isArray(reviews) || reviews.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.style.cssText = 'grid-column: 1 / -1; text-align: center; color: var(--body-text); font-style: italic;';
      emptyMsg.textContent = 'No reviews available yet. Be the first to share your experience!';
      accoladesGrid.appendChild(emptyMsg);
      return;
    }

    reviews.forEach(review => {
      accoladesGrid.appendChild(createReviewCard(review));
    });
  }

  /**
   * Fetches review list from the REST API endpoint and triggers rendering.
   * Supplies hardcoded royal testimonial fallbacks if the server is offline.
   * @returns {Promise<void>}
   */
  async function loadReviews() {
    try {
      const response = await fetch('/api/reviews/list');
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      const data = await response.json();
      renderReviews(data);
    } catch (err) {
      console.error('Error loading reviews:', err);
      // Fallback: If network error or server down, show graceful fallback
      renderReviews([
        {
          id: 'rev-101',
          name: 'Delhi Gourmet Review',
          dish: 'Dal Bukhara & Malai Chaap',
          rating: 5,
          comment: 'An extraordinary revelation in pure vegetarian fine dining. The Dal Bukhara and Malai Chaap rival the best royal kitchens in Asia.'
        },
        {
          id: 'rev-102',
          name: 'Aditya & Meera Singhania',
          dish: 'Maharaja Indian Thali',
          rating: 5,
          comment: 'The Maharaja Suite candlelight anniversary experience was sublime. Flawless hospitality, timeless ambiance, and unforgettable flavors.'
        },
        {
          id: 'rev-103',
          name: 'Epicurean Heritage Journal',
          dish: 'Saffron Handi Biryani',
          rating: 5,
          comment: 'The Saffron Plate proves that centuries-old Indian vegetarian recipes hold unrivaled culinary elegance. Absolutely magnificent.'
        }
      ]);
    }
  }

  // Initial load
  loadReviews();

  // Setup Review Modal & Submission Handler
  const leaveReviewBtn = document.getElementById('leaveReviewBtn');
  const reviewModal = document.getElementById('reviewModal');
  const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');
  const reviewForm = document.getElementById('reviewForm');
  const reviewFormStatus = document.getElementById('reviewFormStatus');
  const submitReviewBtn = document.getElementById('submitReviewBtn');

  function openModal() {
    if (reviewModal) {
      reviewModal.style.display = 'flex';
      const nameInput = document.getElementById('reviewName');
      if (nameInput) nameInput.focus();
    }
  }

  function closeModal() {
    if (reviewModal) {
      reviewModal.style.display = 'none';
      if (reviewFormStatus) {
        reviewFormStatus.style.display = 'none';
        reviewFormStatus.textContent = '';
        reviewFormStatus.className = 'form-msg';
      }
    }
  }

  if (leaveReviewBtn) {
    leaveReviewBtn.addEventListener('click', openModal);
  }

  if (closeReviewModalBtn) {
    closeReviewModalBtn.addEventListener('click', closeModal);
  }

  if (reviewModal) {
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reviewModal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('reviewName')?.value.trim();
      const dish = document.getElementById('reviewDish')?.value.trim();
      const rating = document.getElementById('reviewRating')?.value || '5';
      const comment = document.getElementById('reviewComment')?.value.trim();

      if (!name || !comment) {
        if (reviewFormStatus) {
          reviewFormStatus.style.display = 'block';
          reviewFormStatus.className = 'form-msg error';
          reviewFormStatus.textContent = 'Please provide both your name and review comment.';
        }
        return;
      }

      if (submitReviewBtn) {
        submitReviewBtn.disabled = true;
        submitReviewBtn.textContent = 'SUBMITTING...';
      }

      try {
        const response = await fetch('/api/reviews/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            dish,
            rating: Number(rating),
            comment
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          if (reviewFormStatus) {
            reviewFormStatus.style.display = 'block';
            reviewFormStatus.className = 'form-msg success';
            reviewFormStatus.textContent = 'Thank you! Your review has been submitted.';
          }

          reviewForm.reset();

          // Refresh reviews dynamically from server
          await loadReviews();

          // Auto close modal after brief delay
          setTimeout(() => {
            closeModal();
          }, 1500);
        } else {
          throw new Error(result.error || result.message || 'Failed to submit review');
        }
      } catch (err) {
        if (reviewFormStatus) {
          reviewFormStatus.style.display = 'block';
          reviewFormStatus.className = 'form-msg error';
          reviewFormStatus.textContent = err.message || 'Unable to submit review. Please try again.';
        }
      } finally {
        if (submitReviewBtn) {
          submitReviewBtn.disabled = false;
          submitReviewBtn.textContent = 'SUBMIT REVIEW';
        }
      }
    });
  }
});
