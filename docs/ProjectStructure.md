# Project Structure

This document describes the directory layout of the **Restaurant‑Ecommerce‑Demo‑Site** project used for the 2nd Evaluation (frontend‑only).

```
assessment/
├── index.html            # Main Entry Point & Homepage
├── README.md             # Project overview & documentation
├── .gitignore            # Git ignore configuration
├── css/                  # Stylesheets for global styles and specific views
│   ├── styles.css        # Global design system & layout styles
│   ├── about.css         # Styles for about page
│   ├── auth.css          # Styles for sign-in / registration
│   ├── contact.css       # Styles for contact page
│   ├── gallery.css       # Styles for gallery & lightbox
│   ├── order.css         # Styles for order catalog & checkout
│   ├── reservation.css   # Styles for table reservation form
│   └── team.css          # Styles for project team page
├── js/                   # Client-side JavaScript modules & logic
│   ├── index.js          # Homepage featured menu loading & interaction
│   ├── nav.js            # Sticky navigation & mobile hamburger menu
│   ├── order.js          # Online ordering, cart management & checkout
│   ├── reservation.js    # Table reservation validation & export
│   ├── contact.js        # Contact form validation & JSON persistence
│   ├── gallery.js        # Gallery filtering & fullscreen lightbox
│   ├── team.js           # Team member modal preview
│   └── auth.js           # Guest sign-in validation & export
├── data/                 # Data catalogs and JSON resources
│   └── menu.json         # Shared menu items catalog
├── pages/                # Secondary pages and views
│   ├── about.html        # Heritage & story page
│   ├── auth.html         # Guest account access page
│   ├── contact.html      # Inquiries & location contact page
│   ├── gallery.html      # Dining atmosphere & interior gallery
│   ├── order.html        # Interactive menu catalog & cart page
│   ├── reservation.html  # Table booking page
│   └── team.html         # Project team showcase page
├── images/               # High-resolution dish and ambiance photography
└── docs/                 # Implementation guides and architecture docs
    ├── ImplementationPlan.md
    └── ProjectStructure.md
```

### Key Points
- `index.html` sits at the root as the primary entry point for web servers and static hosts.
- All subpages are cleanly grouped under `pages/`.
- All CSS stylesheets are grouped inside `css/`.
- All client-side JavaScript files are grouped inside `js/`.
- Static data files (like `menu.json`) reside inside `data/`.
- Image assets reside in `images/`.
- Documentation files reside in `docs/`.
