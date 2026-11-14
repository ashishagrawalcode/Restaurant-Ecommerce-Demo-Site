# Implementation Plan – 2nd Evaluation (Frontend Only)

## Overview
The goal is to satisfy the **2nd Evaluation** requirements **without any server‑side code**:
1. Add any missing pages and ensure all pages are correctly linked.
2. Build JavaScript interactions – form validation, UX feedback, and event handling.
3. Enable form submission handling on the client.
4. Persist submitted data as **local JSON files** (downloadable) and also store it in **localStorage** for later retrieval.

---

## 1. Project Structure & New Pages
| Page | Purpose | Action |
|------|---------|--------|
| `index.html` | Home & menu preview – already present. | No change. |
| `reservation.html` | Table reservation form – already present. | Ensure form markup exists (see section 2). |
| `contact.html` | Contact / enquiry form – already present. | Ensure form markup exists (see section 2). |
| `about.html` | Static info – already present. | No change. |
| `team.html` | Team bios – already present. | No change. |
| `auth.html` | Sign‑in / register – static for now. | No change. |
| **`gallery.html`** *(optional)* | Showcase images of dishes. | Create a simple page linked from the nav. |

**Navigation** – the header navigation already contains links to all existing pages. Add a link for the optional `gallery.html` if you create it:
```html
<a href="gallery.html">Gallery</a>
```
Place it alongside the other `<a>` items in the `<nav>`.

---

## 2. Form Markup (HTML) – Minimal Required Fields
### Reservation Form (`reservation.html`)
```html
<form id="reservationForm" novalidate>
  <input type="text" id="name" name="name" placeholder="Your Name" required />
  <input type="email" id="email" name="email" placeholder="Email" required />
  <input type="tel" id="phone" name="phone" placeholder="Phone" required />
  <input type="number" id="guests" name="guests" min="1" placeholder="Guests" required />
  <input type="date" id="date" name="date" required />
  <input type="time" id="time" name="time" required />
  <textarea id="notes" name="notes" placeholder="Special requests"></textarea>
  <button type="submit">Reserve</button>
</form>
```
### Contact Form (`contact.html`)
```html
<form id="contactForm" novalidate>
  <input type="text" id="cName" name="name" placeholder="Your Name" required />
  <input type="email" id="cEmail" name="email" placeholder="Email" required />
  <textarea id="message" name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send</button>
</form>
```
All forms use `novalidate` so we can run our custom validation logic.

---

## 3. Shared JavaScript Utilities (`js/utils.js`)
```js
export function validateField(input) {
  const value = input.value.trim();
  if (!value) { setError(input, 'This field is required'); return false; }
  if (input.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) { setError(input, 'Enter a valid email'); return false; }
  if (input.type === 'tel' && !/^\+?[0-9]{7,15}$/.test(value)) { setError(input, 'Enter a valid phone number'); return false; }
  clearError(input);
  return true;
}
function setError(input, msg) {
  input.classList.add('error');
  let err = input.nextElementSibling;
  if (!err || !err.classList.contains('error-msg')) {
    err = document.createElement('div');
    err.className = 'error-msg';
    input.parentNode.insertBefore(err, input.nextSibling);
  }
  err.textContent = msg;
}
function clearError(input) {
  input.classList.remove('error');
  const err = input.nextElementSibling;
  if (err && err.classList.contains('error-msg')) err.remove();
}
export function persistFormData(key, data) {
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(data);
  localStorage.setItem(key, JSON.stringify(existing));
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${key}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```
Add to pages with:
```html
<script type="module" src="js/utils.js"></script>
```
---

## 4. Page‑Specific Form Handlers
### Reservation (`js/reservation.js`)
```js
import { validateField, persistFormData } from './utils.js';
const form = document.getElementById('reservationForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const inputs = Array.from(form.elements).filter(el => el.tagName !== 'BUTTON');
  if (!inputs.every(validateField)) return;
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    guests: Number(form.guests.value),
    date: form.date.value,
    time: form.time.value,
    notes: form.notes.value.trim(),
    submittedAt: new Date().toISOString()
  };
  persistFormData('reservation', data);
  alert('Reservation saved! A JSON file has been downloaded.');
  form.reset();
});
```
### Contact (`js/contact.js`)
```js
import { validateField, persistFormData } from './utils.js';
const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const inputs = Array.from(form.elements).filter(el => el.tagName !== 'BUTTON');
  if (!inputs.every(validateField)) return;
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
    submittedAt: new Date().toISOString()
  };
  persistFormData('contact', data);
  alert('Message saved! JSON file downloaded.');
  form.reset();
});
```
---

## 5. UX Enhancements & Micro‑Animations
- Fade‑in error messages (`.error-msg { opacity:0; transition:opacity .3s; } .error-msg.show { opacity:1; }`).
- Disable the submit button while validating and show a spinner.
- Highlight successful submission with a green border:
```css
form.success { border:2px solid #4CAF50; animation:pulse 1s ease-out; }
@keyframes pulse { 0% { box-shadow:0 0 0 0 rgba(76,175,80,0.5); } 70% { box-shadow:0 0 0 10px rgba(76,175,80,0); } 100% { box-shadow:0 0 0 0 rgba(76,175,80,0); } }
```
---

## 6. Updating the README
Add a **“2nd Evaluation – Frontend Implementation”** section:
```markdown
## 2nd Evaluation – Frontend Only
- Added `js/utils.js` with validation and JSON‑download helpers.
- Implemented form handling for `reservation.html` and `contact.html`.
- Data is stored in `localStorage` and a downloadable `.json` file is generated on each submit.
- Navigation links updated in `index.html` (and optionally `gallery.html`).
```
---

## 7. Quick Checklist
1. Create `js/utils.js`, `js/reservation.js`, `js/contact.js`.
2. Add `<script type="module" src="js/... .js"></script>` to the relevant HTML pages.
3. Verify form IDs match the markup.
4. Test each form – validation errors appear, successful submit triggers JSON download and `localStorage` entry.
5. Commit and push the changes.

---

## 8. Future‑Proofing (Optional)
If you later need to display saved entries, create a viewer page that reads from `localStorage`:
```js
const entries = JSON.parse(localStorage.getItem('reservation') || '[]');
// Render entries into a <table> …
```
---

*Let me know if you need any additional documentation or refinements.*
