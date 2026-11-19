# The Saffron Plate - Testing & Deployment Runbook

This runbook provides exhaustive test suites, automated and manual verification procedures, CI/CD pipeline automation guidelines, Docker containerization instructions, and production deployment checklists for **The Saffron Plate** fullstack restaurant platform.

---

## 1. Quality Assurance Strategy & Test Pyramid

Our testing methodology ensures that both backend REST services and zero-dependency frontend views maintain stability, cross-browser compatibility, and high availability across all deployment environments.

```
                     ┌────────────────────────┐
                     │   End-to-End (E2E)     │
                     │  User Journey Tests    │
                     ├────────────────────────┤
                     │   Integration Tests    │
                     │  API & Dual Database   │
                     ├────────────────────────┤
                     │      Unit Tests        │
                     │ Utility & Schema Logic │
                     └────────────────────────┘
```

---

## 2. Manual Test Suites & Acceptance Criteria

### 2.1 Test Suite TC-01: Customer Reviews & Accolades (Khush Raghav)

| Test ID | Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :---: |
| `TC-01.1` | Initial Reviews Display | Load homepage (`/` or `/index.html`) and scroll to `.accolades-section`. | Accolades grid loads and displays verified customer cards with star ratings, quotes, and reviewer names. | Pass |
| `TC-01.2` | Open Review Submission Modal | Click "Share Your Experience" button (`#leaveReviewBtn`). | Review dialog modal fades in with smooth transition; focus jumps to name input. | Pass |
| `TC-01.3` | Validation on Blank Comment | Submit form leaving comment empty. | Status message displays warning requiring comment text; form is not dispatched. | Pass |
| `TC-01.4` | Rating Stars Boundary Enforcement | Select rating 5; submit review with valid comment. | API `POST /api/reviews/new` receives payload, assigns next ID (`rev-{n}`), prepends to store. | Pass |
| `TC-01.5` | Dynamic DOM Insertion | Complete valid submission. | Modal closes, status displays success, and newly added card appears at top of accolades grid without page reload. | Pass |
| `TC-01.6` | Offline / Network Failure Fallback | Stop server or simulate offline mode in DevTools. | `loadReviews()` catches error gracefully and displays royal preset testimonial cards without throwing unhandled exceptions. | Pass |

---

### 2.2 Test Suite TC-02: Culinary Menu & Filtering (Ashish Agrawal)

| Test ID | Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :---: |
| `TC-02.1` | Menu Catalog Retrieval | Navigate to `/pages/order.html`. | All 13 signature vegetarian dishes render with photography, pricing in INR, and descriptions. | Pass |
| `TC-02.2` | Category Filtering | Click category pill (e.g. "Royal Classic"). | Grid updates to show only matching items; non-matching cards are filtered smoothly. | Pass |
| `TC-02.3` | Search Input Filtering | Type "Thali" in search box. | Real-time filtering shows Maharaja Indian Thali; other cards hidden. | Pass |
| `TC-02.4` | Add to Cart Interaction | Click "Add to Order" on item card. | Cart badge updates counter; drawer shows line item with calculated subtotal. | Pass |
| `TC-02.5` | Cart Checkout Submission | Fill delivery details and click "Confirm Order". | `POST /api/orders/create` responds with `201 Created` and generated Order ID. | Pass |

---

### 2.3 Test Suite TC-03: Table Reservations (Ashish Agrawal)

| Test ID | Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :---: |
| `TC-03.1` | Reservation Form Load | Navigate to `/pages/reservation.html`. | Booking form renders date picker, time selector, guest count slider, and seating dropdown. | Pass |
| `TC-03.2` | Past Date Rejection | Attempt selecting a date in the past. | Validation prevents submission and highlights date field with warning banner. | Pass |
| `TC-03.3` | Table Confirmation | Fill valid booking details for 4 guests in Garden Pavilion. | Confirmation modal displays booking reference; JSON record added to `reservations.json`. | Pass |

---

### 2.4 Test Suite TC-04: Patron Authentication (Shreya Chaudhary)

| Test ID | Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :---: |
| `TC-04.1` | Patron Registration | Navigate to `/pages/auth.html`; fill name, unique email, 6+ character password. | Account created with `201 Created`; patron session initialized in `localStorage`. | Pass |
| `TC-04.2` | Duplicate Email Rejection | Attempt registering with existing email. | Server returns `409 Conflict` with clear error message; UI displays alert. | Pass |
| `TC-04.3` | Patron Sign-In | Log in with registered credentials. | Server verifies password hash, returns `200 OK` with user profile object. | Pass |
| `TC-04.4` | Invalid Password | Enter incorrect password. | Server returns `401 Unauthorized`; form highlights password input in red. | Pass |

---

### 2.5 Test Suite TC-05: Admin Inquiries Management (Vivek Yadav)

| Test ID | Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :---: |
| `TC-05.1` | Contact Form Submission | Submit inquiry on `/pages/contact.html`. | Inquiry written to `contacts.json` with status `pending`. | Pass |
| `TC-05.2` | Admin Portal Listing | Navigate to `/pages/admin-inquiries.html`. | Inquiry table renders all inquiries with customer name, email, subject, and status badges. | Pass |
| `TC-05.3` | Status Filter Toggle | Toggle filter dropdown to "pending". | Table dynamically filters rows without reloading page. | Pass |
| `TC-05.4` | Mark as Replied | Click "Mark as Replied" button on an inquiry row. | `POST /api/admin/contacts/status` updates record status to `replied` on disk and MongoDB. | Pass |

---

## 3. Automated API Integration Testing with cURL & PowerShell

You can verify all endpoints quickly using PowerShell or Bash scripts without external testing dependencies:

### 3.1 PowerShell Automated Health Check Script
```powershell
# SaffronPlate-HealthCheck.ps1
$BaseUrl = "http://localhost:5000"
Write-Host "Running The Saffron Plate API Health Checks..." -ForegroundColor Cyan

# 1. Test Static Landing Page
$res1 = Invoke-WebRequest -Uri "$BaseUrl/" -Method Get
if ($res1.StatusCode -eq 200) { Write-Host "✓ Landing page OK" -ForegroundColor Green }

# 2. Test Menu API
$res2 = Invoke-RestMethod -Uri "$BaseUrl/api/menu/list" -Method Get
if ($res2.Count -gt 0) { Write-Host "✓ Menu API returned $($res2.Count) dishes" -ForegroundColor Green }

# 3. Test Reviews API
$res3 = Invoke-RestMethod -Uri "$BaseUrl/api/reviews/list" -Method Get
if ($res3.Count -gt 0) { Write-Host "✓ Reviews API returned $($res3.Count) testimonials" -ForegroundColor Green }

# 4. Test Inquiries Admin API
$res4 = Invoke-RestMethod -Uri "$BaseUrl/api/admin/contacts/list" -Method Get
if ($null -ne $res4.total) { Write-Host "✓ Admin Contacts API returned $($res4.total) inquiries" -ForegroundColor Green }

Write-Host "All core API health checks passed successfully!" -ForegroundColor Green
```

---

## 4. Docker Containerization & Deployment Runbook

### 4.1 Production Dockerfile
Create a `Dockerfile` in the root repository to containerize both backend and frontend assets:

```dockerfile
# Multi-stage production container
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy package definitions and install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production

# Copy application source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY docs/ ./docs/
COPY index.html ./

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

WORKDIR /usr/src/app/backend
CMD ["node", "server.js"]
```

### 4.2 Docker Compose Configuration
Create `docker-compose.yml` for unified orchestration with a local MongoDB service:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://mongo:27017/saffron_plate
    depends_on:
      - mongo
    restart: always

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: always

volumes:
  mongo-data:
```

### 4.3 Container Build & Execution Commands
```bash
# Build Docker image
docker build -t saffron-plate:latest .

# Run container standalone
docker run -d -p 5000:5000 --name saffron-web saffron-plate:latest

# Or launch with MongoDB cluster via Docker Compose
docker-compose up -d
```

---

## 5. Reverse Proxy Setup with Nginx

When hosting on a Linux VPS (Ubuntu/Debian), configure Nginx as a reverse proxy with gzip compression and SSL termination:

```nginx
server {
    listen 80;
    server_name saffronplate.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name saffronplate.example.com;

    ssl_certificate /etc/letsencrypt/live/saffronplate.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/saffronplate.example.com/privkey.pem;

    # Gzip compression for high-speed delivery
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 6. Pre-Release Deployment Checklist

Before committing or releasing new changes to production:

- [ ] **No Syntax Errors**: Run `node -c` on all JavaScript files in `backend/` and `frontend/js/`.
- [ ] **JSON Store Integrity**: Verify all files in `backend/data/*.json` contain valid, parseable JSON arrays.
- [ ] **CORS Verification**: Test cross-origin API calls from external ports or domains.
- [ ] **Responsive Design Testing**: Check mobile viewport (375px), tablet viewport (768px), and 4K desktop display (2560px).
- [ ] **Fallback Verification**: Verify that the application functions seamlessly even when `MONGO_URI` is left blank.
- [ ] **Console Cleanliness**: Ensure no unhandled promise rejections or 404 image errors appear in the browser developer console.
