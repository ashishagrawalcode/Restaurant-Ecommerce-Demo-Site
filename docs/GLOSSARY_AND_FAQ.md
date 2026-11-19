# The Saffron Plate - Terminology Glossary & Developer FAQ

This reference provides standard definitions for culinary e-commerce domain concepts, architecture abbreviations, and answers to frequently asked engineering and operational questions for **The Saffron Plate** web application.

---

## 1. Domain Terminology Glossary

### 1.1 Culinary & Dining Terms
- **A la Carte**: Ordering individual dishes separately from the menu rather than as part of a fixed-price set feast.
- **Covers**: The number of individual diners or guests served during a dining seating session.
- **Table Turnover**: The frequency with which a single dining table is occupied, vacated, cleaned, and reseated during a meal service.
- **KDS (Kitchen Display System)**: Digital order management interface that visualizes incoming tickets, cooking times, and line-item completion for the head chef.
- **Dual Plating**: Simultaneous preparation of hot entrees and chilled desserts timed to ensure dishes reach dining tables at peak temperature.
- **Pure Vegetarian (Lacto-Vegetarian)**: Culinary preparation adhering strictly to traditional Indian culinary norms excluding meat, poultry, fish, and eggs while embracing dairy, artisanal ghee, saffron, and fresh spices.

### 1.2 Engineering & Architecture Terms
- **Graceful Fallback**: Architectural design pattern where a software service degrades non-essential functionality without crashing when a dependency (such as MongoDB) is offline.
- **CORS (Cross-Origin Resource Sharing)**: W3C security mechanism allowing web browsers to grant permission for AJAX/Fetch requests to access resources across different origins.
- **MIME Sniffing**: Browser heuristic behavior that attempts to deduce file types when the server fails to provide explicit `Content-Type` headers.
- **JSON-LD (JavaScript Object Notation for Linked Data)**: Structured data format recommended by W3C and Google for annotating entities for search engine knowledge graphs.
- **Preflight Request**: An automatic HTTP `OPTIONS` request sent by browsers prior to complex cross-origin requests to verify permissions.
- **CLS (Cumulative Layout Shift)**: Google Core Web Vital measuring unexpected layout shifts during the visual loading phase.

---

## 2. Developer Frequently Asked Questions (FAQ)

### Q1: Why does the project use native Node.js `http` instead of Express.js?
**Answer**: Using Node.js's native `http` module provides:
1. Deep platform understanding with zero framework abstractions.
2. Ultra-lightweight footprint (~28MB RAM vs ~100MB+ for framework stacks).
3. Near-instantaneous cold boots (<150ms).
4. Direct control over streaming buffers, CORS headers, and MIME resolution without middleware overhead.

### Q2: What happens if MongoDB Atlas credentials are not provided?
**Answer**: The application boots normally and logs `Running in JSON database mode`. All read queries and write mutations (reviews, orders, reservations, contact inquiries, patron accounts) are handled seamlessly by the local `backend/data/*.json` files. No database daemon is required to run the full application.

### Q3: How do customer reviews persist across restarts?
**Answer**: When a diner submits a review via `POST /api/reviews/new`:
1. The backend parses and sanitizes the payload in `routes/reviewRoutes.js`.
2. The review is prepended to `backend/data/reviews.json` using atomic synchronous filesystem writes.
3. If MongoDB is connected, it is simultaneously persisted to the `Review` collection.
4. On subsequent page loads, `GET /api/reviews/list` reads and returns the updated array.

### Q4: How is mobile responsiveness handled without CSS frameworks like Bootstrap or Tailwind?
**Answer**: The styling architecture in `frontend/css/` uses native CSS3 Flexbox and CSS Grid alongside media query breakpoints (`768px`, `1024px`). CSS custom properties (`--canvas-bg`, `--gold-accent`) enable global design consistency with zero build steps or CSS bundle size inflation.

### Q5: How do I test the backend API endpoints locally?
**Answer**: You can test endpoints using standard tools:
- **cURL**: `curl -X GET http://localhost:5000/api/reviews/list`
- **PowerShell**: `Invoke-RestMethod -Uri http://localhost:5000/api/menu/list`
- **Postman / Thunder Client**: Import the routes documented in `docs/API_REFERENCE.md`.
- **Browser**: Direct navigation to `http://localhost:5000/api/menu/list`.
