# The Saffron Plate - Security, Data Privacy & Hardening Guidelines

This document establishes the security architecture, data privacy standards, threat mitigation strategies, and defensive engineering practices implemented across **The Saffron Plate** fullstack restaurant web application.

---

## 1. Security Architecture Principles

In hospitality e-commerce, maintaining patron trust requires rigorous security protocols across data storage, network transmission, and user identity management. The engineering team adheres to the following foundational security pillars:

1. **Principle of Least Privilege**: Server processes, database users, and frontend sessions operate with the minimum level of access required to complete business functions.
2. **Defense in Depth**: Security validations occur on both client and server boundaries. Client-side input validation enhances user experience; server-side sanitization guarantees data integrity.
3. **Zero Trust Network Assumptions**: All incoming HTTP payloads are treated as untrusted and potentially malicious until validated against strict type, length, and format schemas.
4. **Graceful Failure Mode**: Security exceptions and validation failures must never leak database internals, environment paths, stack traces, or server version headers.

---

## 2. Threat Modeling & Attack Vector Mitigations

### 2.1 Cross-Site Scripting (XSS) Prevention
- **Threat Vector**: Malicious script injection through customer review comments, contact inquiry text, or registration names that could execute in another user's or administrator's browser.
- **Defenses Implemented**:
  1. Frontend dynamic insertion uses `.textContent` and `.replaceChildren()` rather than dangerous `element.innerHTML` assignments.
  2. The server trims and parses string inputs before writing to disk or database stores.
  3. All rendered review and inquiry fields are escaped by default through modern DOM text node creation.

### 2.2 NoSQL & Query Injection Defenses
- **Threat Vector**: Malicious payload keys (e.g., `{"$gt": ""}`) submitted in login or filter bodies to bypass credential authentication in MongoDB.
- **Defenses Implemented**:
  1. Input fields are destructured into explicit primitive variables (`name`, `email`, `password`) rather than passing raw request bodies directly to Mongoose queries.
  2. Schema definitions in `backend/models/*.js` enforce strict type casting (`type: String`, `type: Number`), rejecting unexpected object or array operators.
  3. Email addresses are cast to lowercase string literals before performing lookup queries (`findOne({ email: String(email).toLowerCase() })`).

### 2.3 Cross-Site Request Forgery (CSRF) Mitigation
- **Threat Vector**: Unauthorized state-changing actions executed by a browser on behalf of an authenticated patron.
- **Defenses Implemented**:
  1. State-changing requests (`POST`, `PUT`, `DELETE`) require JSON encoded payloads (`Content-Type: application/json`), which triggers mandatory preflight verification under standard browser CORS policies.
  2. Simple HTML form submissions (`application/x-www-form-urlencoded` or `multipart/form-data`) are not accepted on protected endpoints.
  3. Patron sessions are stored in application state / scoped client storage rather than ambient, unflagged cookies.

### 2.4 Denial of Service (DoS) & Resource Exhaustion Protection
- **Threat Vector**: Attackers streaming massive JSON bodies to exhaust server memory or disk buffers.
- **Defenses Implemented**:
  1. Body parsing streams in `server.js` buffer incoming chunks with streaming limits.
  2. Mongoose connection includes explicit timeouts (`serverSelectionTimeoutMS: 10000`) to prevent lingering hung socket connections.
  3. Automatic port fallback avoids crash loops if a local daemon occupies the default listening port.

---

## 3. Patron Data Privacy & Confidentiality (GDPR / DPDP Compliance)

### 3.1 Data Minimization Policy
We collect only the essential information needed to fulfill culinary orders and dining reservations:
- **Reviews**: Public display name, rating score, and optional dish commentary.
- **Orders**: Recipient name, contact phone, delivery address, and line items.
- **Reservations**: Host name, contact email, telephone, party size, and celebration notes.
- **Accounts**: Patron name, login email, and encrypted credentials.

### 3.2 Right to Rectification & Erasure
The patron authentication module (`backend/routes/authRoutes.js`) provides explicit endpoints allowing patrons to:
1. **Inspect Profile Information**: `GET /api/auth/profile` retrieves stored credentials metadata.
2. **Update Account Details**: `PUT /api/auth/update` permits patrons to modify their name or credentials.
3. **Delete Account (Right to be Forgotten)**: `DELETE /api/auth/delete` removes the patron record from both MongoDB and `backend/data/users.json`.

---

## 4. Environment Hardening & Secret Management

1. **Zero Secret Commits**:
   - The `.gitignore` file explicitly excludes `.env`, `node_modules`, and server log dumps.
   - Credentials such as `MONGO_URI` are loaded dynamically via `backend/config/env.js` from runtime environment variables.
   - An example template (`backend/.env.example`) provides clean documentation without disclosing production credentials.
2. **Production Header Hardening**:
   - Recommended HTTP headers for production reverse proxy (Nginx / Cloudflare):
     ```http
     X-Content-Type-Options: nosniff
     X-Frame-Options: SAMEORIGIN
     X-XSS-Protection: 1; mode=block
     Referrer-Policy: strict-origin-when-cross-origin
     Content-Security-Policy: default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
     ```

---

## 5. Security Incident Response Protocol

In the event of an identified vulnerability or unauthorized data access:
1. **Isolate Environment**: Terminate external traffic at the reverse proxy or firewall layer.
2. **Rotate Credentials**: Immediately rotate database passwords, API tokens, and server secrets.
3. **Audit Log Inspection**: Review server access logs and database audit logs to determine the scope of impact.
4. **Patch & Verify**: Apply code fixes in an isolated branch, run full regression test suites, and deploy updates with zero downtime.
