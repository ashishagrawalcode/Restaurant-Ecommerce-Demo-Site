# The Saffron Plate - Developer & Contributor Guide

Welcome to **The Saffron Plate** codebase developer guide. This document serves as an exhaustive technical manual for engineering contributors, onboarding developers, and academic evaluators. It outlines system architecture, modular design principles, engineering conventions, environment workflows, and deployment procedures.

---

## 1. Executive Architecture Summary

**The Saffron Plate** is designed as a high-performance, ultra-luxurious fullstack web application for fine vegetarian dining. The core architectural philosophy is centered around:

1. **Zero-Dependency Frontend**: The client user interface is authored in pure semantic HTML5, modern vanilla CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism, Backdrop Filters), and modular vanilla ES6 JavaScript. No external build frameworks (Webpack, Vite, React, Vue) are required, guaranteeing instant page loads and zero bundle overhead.
2. **Modular Native HTTP Server**: The backend is powered by Node.js using native `http`, `fs`, `path`, and URL parsing modules. This avoids heavy framework bloat while providing full REST capabilities.
3. **Hybrid Dual-Store Persistence**: The platform supports transparent dual persistence:
   - **Production Engine**: MongoDB Atlas via Mongoose ODM schemas.
   - **Standalone Local Engine**: Local JSON file storage in `backend/data/`. If MongoDB is absent or unreachable, the system transparently persists transactions to local disk without throwing unhandled exceptions.
4. **Decoupled Team Modules**: The codebase distributes discrete feature domains to individual contributors through isolated route modules and front-end controllers, minimizing merge conflicts and maximizing testability.

---

## 2. Team Member Module Allocation Matrix

| Contributor | Role & Domain | Backend Components | Frontend Components | Primary Data Models |
| :--- | :--- | :--- | :--- | :--- |
| **Ashish Agrawal** | Lead Architect, Core Server & Ordering | `server.js`, `config/db.js`, `config/env.js` | `index.html`, `index.js`, `order.js`, `reservation.js` | `Menu.js`, `Order.js`, `Reservation.js` |
| **Khush Raghav** | Customer Testimonials, Reviews & Ratings | `routes/reviewRoutes.js`, `models/Review.js` | `reviews.js`, `index.html` (Accolades), `styles.css` | `Review.js`, `reviews.json` |
| **Shreya Chaudhary** | Patron Authentication & User CRUD | `routes/authRoutes.js`, `models/User.js` | `auth.html`, `auth.js`, `auth.css` | `User.js`, `users.json` |
| **Vivek Yadav** | Inquiry Management & Admin Portal | `routes/contactRoutes.js`, `models/Contact.js` | `contact.html`, `contact.js`, `admin-inquiries.html`, `admin-inquiries.js` | `Contact.js`, `contacts.json` |

---

## 3. Directory Layout & Source Tree Navigation

```
assessment/
├── README.md                          # Primary project documentation and quickstart
├── .gitignore                         # Git exclusion rules for node_modules and logs
├── index.html                         # Root repository redirection gateway
├── package.json                       # Root workspace scripts and metadata
├── docs/                              # Project architecture, guidelines and manuals
│   ├── API_REFERENCE.md               # Complete REST API endpoint documentation
│   ├── DATABASE_SCHEMA.md             # Complete Mongoose and JSON data dictionaries
│   ├── DEVELOPER_GUIDE.md             # This comprehensive engineering guide
│   ├── ImplementationPlan.md          # 4-person milestone and task breakdown
│   ├── ProjectStructure.md            # Directory layout architecture reference
│   └── TESTING_AND_DEPLOYMENT.md      # Test runbook, verification checklists and QA
├── backend/                           # Node.js backend application service
│   ├── server.js                      # Core HTTP dispatcher and static file server
│   ├── package.json                   # Node package dependencies and npm scripts
│   ├── .env.example                   # Environment configuration template
│   ├── config/                        # Infrastructure and environment loaders
│   │   ├── db.js                      # MongoDB connection and schema compiler
│   │   └── env.js                     # Native zero-dependency .env file parser
│   ├── models/                        # Mongoose schema definitions
│   │   ├── Contact.js                 # Customer contact inquiry schema
│   │   ├── Menu.js                    # Culinary catalog item schema
│   │   ├── Order.js                   # Cart and order checkout schema
│   │   ├── Reservation.js             # Table reservation booking schema
│   │   ├── Review.js                  # Customer rating & feedback schema (Khush)
│   │   └── User.js                    # Patron and admin credentials schema
│   ├── routes/                        # Modular route handlers for teammates
│   │   ├── authRoutes.js              # Patron authentication CRUD routes (Shreya)
│   │   ├── contactRoutes.js           # Admin inquiry management routes (Vivek)
│   │   └── reviewRoutes.js            # Customer feedback & reviews routes (Khush)
│   └── data/                          # Persistent JSON document stores
│       ├── contacts.json              # Inquiries flat file database
│       ├── menu.json                  # Culinary catalog flat file database
│       ├── orders.json                # Customer orders flat file database
│       ├── reservations.json          # Table bookings flat file database
│       ├── reviews.json               # Customer reviews flat file database
│       └── users.json                 # Patron accounts flat file database
└── frontend/                          # Client-side presentation and interaction layer
    ├── index.html                     # Main restaurant landing page
    ├── css/                           # Modular CSS stylesheets
    │   ├── styles.css                 # Global design system, typography and reset
    │   ├── about.css                  # Heritage story and culinary philosophy
    │   ├── auth.css                   # Patron modal and authentication styling
    │   ├── contact.css                # Contact form layout and location map
    │   ├── gallery.css                # Visual media grid and modal lightbox
    │   ├── order.css                  # Menu filtering and checkout drawer
    │   ├── reservation.css            # Table booking picker styling
    │   └── team.css                   # Contributor cards and profile modal
    ├── js/                            # Client-side JavaScript modules
    │   ├── index.js                   # Homepage menu showcase and highlights
    │   ├── nav.js                     # Sticky header and responsive drawer
    │   ├── order.js                   # Cart calculations and ordering workflow
    │   ├── reservation.js             # Booking validations and date pickers
    │   ├── contact.js                 # Contact submission validation
    │   ├── admin-inquiries.js         # Inquiry status administration portal
    │   ├── gallery.js                 # Filter tags and lightbox modal controller
    │   ├── team.js                    # Team bio dialog controller
    │   ├── auth.js                    # Patron authentication and local session
    │   └── reviews.js                 # Dynamic reviews loader and modal form (Khush)
    ├── pages/                         # Multi-page HTML application views
    │   ├── about.html                 # Culinary history and culinary team
    │   ├── auth.html                  # Patron sign-in and registration portal
    │   ├── contact.html               # Contact form and reservations desk
    │   ├── admin-inquiries.html       # Management view for customer inquiries
    │   ├── gallery.html               # High-resolution architectural photography
    │   ├── order.html                 # Online culinary catalog and cart
    │   ├── reservation.html           # Dedicated table reservation page
    │   └── team.html                  # Project team contributors
    └── images/                        # Photography assets and branding iconography
```

---

## 4. Local Environment Setup & Runbook

### 4.1 System Prerequisites
- **Node.js**: v16.x, v18.x, or v20.x LTS installed.
- **Git**: v2.30+ installed.
- **Modern Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari with CSS Grid and `backdrop-filter` support.

### 4.2 Installation Procedure

1. **Clone Repository**:
   ```bash
   git clone https://github.com/raghavhub-ux/Restaurant-Ecommerce-Demo-Site.git
   cd Restaurant-Ecommerce-Demo-Site
   ```

2. **Navigate to Backend Directory**:
   ```bash
   cd backend
   ```

3. **Install Node Dependencies** (Optional Mongoose driver):
   ```bash
   npm install
   ```

4. **Configure Environment Variables** (Optional):
   Copy `.env.example` to `.env` in the `backend/` directory:
   ```bash
   cp .env.example .env
   ```
   Modify variables as desired:
   ```ini
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/saffron_plate
   ```
   *Note: If `MONGO_URI` is omitted, the backend automatically operates in JSON file database mode.*

5. **Start Development Server**:
   ```bash
   node server.js
   ```

6. **Access Application**:
   Open browser at:
   ```http
   http://localhost:5000/
   ```

---

## 5. Backend Server Implementation Details

### 5.1 Static Asset Serving
`server.js` functions as both an API gateway and static file server for all files located in `../frontend`:
- Routes matching `/` serve `frontend/index.html`.
- Routes matching `/pages/{page}.html` serve the appropriate view from `frontend/pages/`.
- File extensions are resolved against `MIME_TYPES` lookup table (`.html`, `.css`, `.js`, `.json`, `.jpg`, `.png`, `.svg`, `.ico`).
- 404 responses are returned if a requested static file is absent from disk.

### 5.2 Helper Utilities Contract
Each modular route file receives a shared `helpers` parameter containing core utilities:

```javascript
helpers = {
  readJson: (filename) => Array|Object,
  writeJson: (filename, data) => boolean,
  sendJson: (res, statusCode, payload) => void,
  isConnected: () => boolean,
  getModels: () => Object.<string, mongoose.Model>
}
```

#### Guidelines for Route Authors:
- Always check `method` and `pathname` at the top of route branches.
- Use `sendJson(res, statusCode, body)` for standardized JSON responses with CORS headers.
- When saving state, write to `backend/data/*.json` first to guarantee offline / zero-setup durability.
- If `isConnected()` evaluates to `true`, dispatch an asynchronous database transaction to Mongoose model without blocking the HTTP response stream.

---

## 6. Frontend Architectural Standards

### 6.1 Design Tokens & CSS Variables
All stylesheets import and adhere to the global variables defined in `frontend/css/styles.css`:

```css
:root {
  --canvas-bg: #171717;        /* Core backdrop canvas */
  --card-surface: #211E1B;     /* Card surface and component fill */
  --text-heading: #F5EFE6;     /* Primary headings and brand typography */
  --text-body: #D8D0C4;        /* Secondary paragraph text */
  --gold-accent: #C9A227;      /* Royal gold buttons, highlights, badges */
  --gold-hover: #E0B93D;       /* Interactive hover state */
  --border-subtle: #4A4038;    /* Surface dividers and card borders */
  --font-serif: 'Cinzel', serif;
  --font-display: 'Cormorant Garamond', serif;
  --font-sans: 'Jost', sans-serif;
}
```

### 6.2 DOM Interaction & Form Validation
1. Use `document.addEventListener('DOMContentLoaded', ...)` to encapsulate page initializers.
2. Gracefully handle missing DOM selectors to prevent console runtime exceptions on pages that share script bundles.
3. Use modern DOM methods like `.replaceChildren()` rather than dangerous `innerHTML` assignments when injecting customer feedback.
4. Provide immediate inline validation feedback with accessible status messages (`.form-msg`).

---

## 7. Quality Assurance, Security & Git Conventions

### 7.1 Input Sanitization
- All text submitted through forms (reviews, inquiries, registration) must be trimmed and stripped of potential script injection vectors before writing to database or JSON stores.
- Number fields (e.g., ratings) must be clamped using `Math.max(1, Math.min(5, ...))` to maintain domain constraints.

### 7.2 Commit Message Standard
Follow the Conventional Commits specification:
- `docs(...)`: Documentation updates, JSDoc annotations, guides, or manuals.
- `feat(...)`: New user-facing feature or API endpoint.
- `fix(...)`: Bug fix or error handling patch.
- `refactor(...)`: Code cleanup with no functional behavior changes.
- `style(...)`: Formatting, whitespace, or CSS aesthetic improvements.

### 7.3 Branching Strategy
- `main`: Production-ready, stable codebase branch.
- `docs/*`: Documentation and architectural manuals.
- `feat/*`: Feature additions developed in isolated workspaces.
- `fix/*`: Targeted defect repairs.
