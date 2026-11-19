# Project Structure

This document describes the directory layout of **The Saffron Plate** fullstack restaurant web application.

```
assessment/
├── README.md                 # Project overview & documentation
├── .gitignore                # Git ignore configuration
├── backend/                  # Node.js REST API & static server
│   ├── package.json          # Node project scripts & metadata
│   ├── server.js             # Core HTTP server & primary API routes (Ashish)
│   ├── config/               # Database and environment configuration
│   │   ├── db.js             # MongoDB connection & Mongoose model compiler
│   │   └── env.js            # Lightweight .env parser & loader
│   ├── models/               # Mongoose schemas for data models
│   │   ├── Contact.js        # Contact inquiry schema (Vivek)
│   │   ├── Menu.js           # Menu items schema
│   │   ├── Order.js          # Customer orders schema
│   │   ├── Reservation.js    # Dining reservations schema
│   │   ├── Review.js         # Customer ratings & reviews schema (Khush)
│   │   └── User.js           # Patron & staff account schema (Shreya)
│   ├── data/                 # JSON persistence store
│   │   ├── menu.json         # Master menu catalog
│   │   ├── orders.json       # Live customer orders
│   │   ├── reservations.json # Table booking records
│   │   ├── contacts.json     # Contact inquiries
│   │   ├── users.json        # Patron accounts
│   │   └── reviews.json      # Patron feedback & ratings
│   └── routes/               # Modular route files for teammates
│       ├── authRoutes.js     # User authentication module (Shreya)
│       ├── contactRoutes.js  # Inquiry admin module (Vivek)
│       └── reviewRoutes.js   # Customer reviews module (Khush)
├── frontend/                 # Client-side user interface
│   ├── index.html            # Main Entry Point & Homepage
│   ├── css/                  # All CSS stylesheets
│   │   ├── styles.css        # Global styles & design system
│   │   ├── about.css         # Styles for about page
│   │   ├── auth.css          # Styles for sign-in / registration
│   │   ├── contact.css       # Styles for contact page
│   │   ├── gallery.css       # Styles for gallery & lightbox
│   │   ├── order.css         # Styles for ordering & cart
│   │   ├── reservation.css   # Styles for table reservation form
│   │   └── team.css          # Styles for project team showcase
│   ├── js/                   # Client-side JavaScript modules
│   │   ├── index.js          # Homepage menu preview loader
│   │   ├── nav.js            # Sticky navigation & mobile drawer
│   │   ├── order.js          # Menu filtering, cart & checkout
│   │   ├── reservation.js    # Table reservation validation
│   │   ├── contact.js        # Contact form validation & submission
│   │   ├── admin-inquiries.js # Admin inquiries management & reply status logic (Vivek)
│   │   ├── gallery.js        # Gallery filtering & fullscreen lightbox
│   │   ├── team.js           # Team member modal preview
│   │   ├── auth.js           # Guest sign-in & session handling
│   │   └── reviews.js        # Patron reviews & ratings dynamic loader (Khush)
│   ├── data/                 # Client menu backup catalog
│   │   └── menu.json
│   ├── pages/                # Multi-page application views
│   │   ├── about.html        # Restaurant heritage & story
│   │   ├── auth.html         # Patron sign-in & register
│   │   ├── contact.html      # Contact form & location information
│   │   ├── admin-inquiries.html # Admin customer inquiries view & status portal (Vivek)
│   │   ├── gallery.html      # Ambiance & architectural gallery
│   │   ├── order.html        # Interactive menu catalog & cart
│   │   ├── reservation.html  # Table booking form
│   │   └── team.html         # Project team contributors
│   └── images/               # High-resolution dish and team photography
└── docs/                     # Project documentation & guidelines
    ├── ImplementationPlan.md # 4-person task distribution & plan
    └── ProjectStructure.md   # This architecture guide
```

### Running the Application
```powershell
cd backend
node server.js
```
The server will start at `http://localhost:5000/` and serve the frontend files automatically while providing full REST API capabilities.
