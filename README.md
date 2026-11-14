<div align="center">

# 👑 THE SAFFRON PLATE
### *Fine Dining & Pure Vegetarian Kitchen*

An ultra-luxurious, pure HTML5 & CSS3 website for **The Saffron Plate**, a high-end vegetarian restaurant blending royal Indian culinary heritage with modern gastronomy aesthetics.

[Live Demo](#-getting-started) • [Menu Highlights](#-signature-menu) • [Design System](#-design-system) • [Project Structure](#-file-structure)

---

</div>

## 🌟 Overview

**The Saffron Plate** offers an exquisite dining experience with a design inspired by world-class gastronomy interfaces (e.g., *LUMIÈRE*). Built with **zero JavaScript**, the website leverages advanced CSS3 capabilities including backdrop-filters, custom properties, glassmorphism, responsive grid architecture, and pure CSS interaction hooks.

---

## ✨ Key Design & Architectural Features

- 🌌 **Overlay Navigation Bar**: Transparent header overlaying the full-bleed hero backdrop image.
- 🖼️ **Full-Width Hero Section**: Split-gradient vignette backdrop ensuring perfect text legibility alongside high-resolution food photography.
- 🍷 **Quick Reservation Bar**: Positioned beneath the hero section for instant table booking with custom select dropdowns.
- 🍽️ **Culinary Highlights Grid**: 3-column photo-card layout flanked by botanical leaf line art margin accents.
- 📜 **13 Signature Menu Delicacies**: High-resolution photography cards featuring classic Indian, Asian, South Indian, and dessert creations.
- 🚫 **Zero JavaScript Dependency**: Built using pure semantic HTML5 and vanilla CSS3 for ultra-fast performance and clean layout.
- 🔇 **Zero Emojis**: Clean, elegant serif and sans-serif typography for a pure, ultra-luxury aesthetic.

---

## 🎨 Design System & Color Palette

The color scheme is crafted to evoke royal Indian heritage, warm hospitality, and timeless luxury.

| Color Name | Hex Code | Visual Sample | Usage |
| :--- | :--- | :---: | :--- |
| **Main Background** | `#171717` | `⬛` | Page background canvas |
| **Card & Bar Surface** | `#211E1B` | `🟫` | Navbar, cards, reservation bar & footer |
| **Primary Heading** | `#F5EFE6` | `⬜` | Brand titles, section headers & quote text |
| **Body Paragraph** | `#D8D0C4` | `🌫️` | Descriptive text, subheadings & footer links |
| **Gold Highlight** | `#C9A227` | `🟨` | Buttons, prices, icons & borders |
| **Border Divider** | `#4A4038` | `🤎` | Card outlines & section dividers |
| **Gold Hover Glow** | `#E0B93D` | `✨` | Interactive hover states & callouts |

---

## 📜 Signature Menu

| Category | Dish Name | Description | Price |
| :--- | :--- | :--- | :-: |
| **Royal Classic** | **Chole Bhature** | Pillowy fried bhature with slow-simmered dark chana masala | ₹120 |
| **Street Special** | **Golgappe** | Crisp puris filled with spiced potato sprouts & mint water | ₹80 |
| **Chef's Special** | **Gulab Jamun** | Soft khoya dumplings soaked in warm rose-cardamom syrup | ₹70 |
| **Asian Gourmet** | **Hakka Noodles** | Wok-tossed noodles with fresh vegetables & sesame | ₹150 |
| **Luxury Dessert** | **Hot Fudge Sundae** | Vanilla gelato with warm dark chocolate fudge & almonds | ₹140 |
| **Royal Feast** | **Maharaja Indian Thali** | Platter of Paneer Butter Masala, Dal Makhani, Pulao, Naan & Lassi | ₹280 |
| **Royal Classic** | **Malai Chaap** | Char-grilled soya skewers in cream & cashew marinade | ₹180 |
| **South Indian** | **Masala Dosa** | Golden crispy crepe filled with spiced potato masala | ₹135 |
| **Steamed Special** | **Momos** | Steamed vegetable dumplings with fiery red chutney | ₹110 |
| **Artisan Ramen** | **Ramen** | Rich vegetarian miso broth with hand-pulled noodles & bok choy | ₹190 |
| **Signature Dessert** | **Rasmalai** | Delicate chenna discs in saffron-cardamom milk | ₹90 |
| **Cold Refreshment** | **Strawberry Shake** | Mahabaleshwar strawberry shake with double cream | ₹130 |

---

## 📁 File Structure

```
assessment/
├── README.md                 # Project Documentation
├── .gitignore                # Git ignore rules
├── backend/                  # Node.js REST API & static server
│   ├── package.json          # Node project scripts & metadata
│   ├── server.js             # Core HTTP server & primary API routes (Ashish)
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
│   │   ├── gallery.js        # Gallery filtering & fullscreen lightbox
│   │   ├── team.js           # Team member modal preview
│   │   └── auth.js           # Guest sign-in & session handling
│   ├── data/                 # Client menu backup catalog
│   │   └── menu.json
│   ├── pages/                # Multi-page application views
│   │   ├── about.html        # Restaurant heritage & story
│   │   ├── auth.html         # Patron sign-in & register
│   │   ├── contact.html      # Contact form & location information
│   │   ├── gallery.html      # Ambiance & architectural gallery
│   │   ├── order.html        # Interactive menu catalog & cart
│   │   ├── reservation.html  # Table booking form
│   │   └── team.html         # Project team contributors
│   └── images/               # High-resolution dish and team photography
└── docs/                     # Project documentation & guidelines
    ├── ImplementationPlan.md # 4-person task distribution & plan
    └── ProjectStructure.md   # Architecture & directory guide
```

---

## 👥 Project Team

- **Ashish Agrawal** (Fullstack Lead, Core Backend Server, Orders & Reservations Architecture)
- **Shreya Chaudhary** (Authentication & User Account Management)
- **Vivek Yadav** (Contact Inquiries & Admin Review)
- **Khush Raghav** (Patron Reviews & Dietary Feedback)

---

## 💻 Getting Started

To run both frontend and backend locally with one command:

1. **Open terminal in `backend/`**:
   ```bash
   cd backend
   node server.js
   ```
2. **Open browser**:
   - `http://localhost:5000/` (Loads the full website and connects directly to backend REST APIs)

---

## ✒️ Typography & Fonts

- **Headings & Brand**: [Cinzel](https://fonts.google.com/specimen/Cinzel) (Serif)
- **Subtitles & Quotes**: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (Display Italic)
- **Body & UI Elements**: [Jost](https://fonts.google.com/specimen/Jost) (Clean Sans-serif)

---

<div align="center">

Crafted with Excellence &amp; Precision • **The Saffron Plate Pure Vegetarian Kitchen**

</div>