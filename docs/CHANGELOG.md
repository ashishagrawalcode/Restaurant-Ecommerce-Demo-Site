# The Saffron Plate - Release Notes & Engineering Changelog

All notable changes to the **The Saffron Plate** fullstack restaurant web application are documented in this file in reverse chronological order.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - 2026-11-19

### Added
- Comprehensive REST API reference manual documenting all 10 endpoints, payload schemas, and response formats (`docs/API_REFERENCE.md`).
- Developer and contributor onboarding guide with directory layouts, prerequisites, and runbooks (`docs/DEVELOPER_GUIDE.md`).
- Complete data dictionary and database schema documentation for all six MongoDB and JSON collections (`docs/DATABASE_SCHEMA.md`).
- Testing runbook containing manual test suites, PowerShell health check script, Docker compose files, and Nginx reverse proxy configuration (`docs/TESTING_AND_DEPLOYMENT.md`).
- Visual design system guide detailing royal Indian aesthetics, color tokens, typography scales, layout grids, and WCAG AA accessibility contrast ratios (`docs/FRONTEND_DESIGN_SYSTEM.md`).
- Cybersecurity and privacy guide outlining XSS defenses, NoSQL injection mitigations, CSRF handling, and patron data rights (`docs/SECURITY_AND_DATA_PRIVACY.md`).
- Systems engineering whitepaper analyzing native Node.js HTTP event loops, memory footprints, and dual-mode persistence mechanics (`docs/ARCHITECTURE_DEEP_DIVE.md`).
- Contributor code of conduct and pull request checklist (`docs/CONTRIBUTING_GUIDELINES.md`).
- Performance and SEO architecture guide covering Core Web Vitals, JSON-LD Schema.org structured data, and OpenGraph social meta tags (`docs/PERFORMANCE_AND_SEO_GUIDE.md`).
- Disaster recovery runbook with automated snapshot backup PowerShell scripts and JSON integrity verification tools (`docs/DISASTER_RECOVERY_AND_BACKUP.md`).
- Environment variable infrastructure guide with MongoDB Atlas IP whitelisting instructions and PM2 cluster configurations (`docs/ENVIRONMENT_CONFIG_GUIDE.md`).

---

## [1.2.0] - 2026-11-18

### Added
- **Khush Raghav**: Customer testimonials & ratings module (`backend/routes/reviewRoutes.js`, `backend/models/Review.js`, `frontend/js/reviews.js`). Dynamic client-side rendering with star rating formatting and review submission modal.
- **Vivek Yadav**: Administrative contact inquiries portal (`frontend/pages/admin-inquiries.html`, `frontend/js/admin-inquiries.js`, `backend/routes/contactRoutes.js`). Inquiry listing with status filtering and reply management.
- **Ashish Agrawal**: Automatic port fallback handling `EADDRINUSE` with graceful port increment in `backend/server.js`.

---

## [1.1.0] - 2026-11-14

### Added
- **Shreya Chaudhary**: Patron authentication and user account CRUD module (`backend/routes/authRoutes.js`, `backend/models/User.js`, `frontend/pages/auth.html`, `frontend/js/auth.js`). Registration, credential verification, profile inspection, update, and deletion endpoints.
- Synchronized initial database seed datasets in `backend/data/users.json`.

---

## [1.0.0] - 2026-10-28

### Added
- **Ashish Agrawal**: Core HTTP backend server with static asset routing and REST endpoint dispatching (`backend/server.js`).
- Dual-mode database connection architecture with Mongoose schemas and zero-dependency local JSON file fallbacks (`backend/config/db.js`, `backend/config/env.js`).
- Full culinary catalog of 13 royal vegetarian delicacies (`backend/data/menu.json`).
- Online cart management and order creation endpoint (`/api/orders/create`).
- Table reservation system with custom guest selectors and date picker (`/api/reservations/book`).
- Multi-page responsive frontend views: Home, About Us, Gallery, Order Online, Table Reservations, Contact Desk, and Team Showcase.
