// reviews.js - Customer Reviews, Ratings & Testimonials Module
// Assigned to: Khush Raghav
// Goal: Allow diners to submit feedback and dynamically display customer reviews on the website.

document.addEventListener('DOMContentLoaded', () => {
  const accoladesGrid = document.querySelector('.accolades-grid');
  if (!accoladesGrid) return;

  // Helper: Format rating stars (e.g., 5 -> "★★★★★", 4 -> "★★★★☆")
  function formatStars(rating) {
    const r = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  // Render a single review card DOM element
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

  // Render all reviews into .accolades-grid
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

  // Fetch reviews from backend API
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
