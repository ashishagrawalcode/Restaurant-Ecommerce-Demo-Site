# The Saffron Plate - REST API Reference Manual

Welcome to the official REST API reference for **The Saffron Plate** fine dining restaurant web application. This document provides complete endpoint specifications, HTTP methods, request headers, payload schemas, query parameters, response codes, and practical `curl` examples for frontend integration and backend maintenance.

---

## 1. Global API Architecture & Protocol Conventions

### 1.1 Base Server URL
All API requests are routed through the backend HTTP server. When developing locally or hosting on a single domain, endpoints are served relative to the root origin:
```http
http://localhost:5000/api
```

### 1.2 Content Type & Payload Encoding
- **Request Format**: All incoming `POST` and `PUT` request bodies must be JSON encoded with the header:
  ```http
  Content-Type: application/json
  ```
- **Response Format**: All successful and error responses return UTF-8 serialized JSON with:
  ```http
  Content-Type: application/json; charset=utf-8
  ```

### 1.3 Cross-Origin Resource Sharing (CORS)
The backend server implements automated CORS preflight handling for decoupled frontend environments and development tooling:
- **Allowed Origins**: `*` (Permits cross-origin fetch requests from any local development server or hosted preview).
- **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Allowed Headers**: `Content-Type, Authorization, Accept`
- **Preflight Max-Age**: Cached automatically with status code `204 No Content`.

### 1.4 Dual Persistence Engine
The API operates a hybrid persistence architecture:
1. **Primary Persistence Engine**: MongoDB via Mongoose ODM when `MONGO_URI` is supplied in the `.env` configuration.
2. **Graceful Fallback Engine**: Local flat-file JSON storage in `backend/data/*.json`. If MongoDB connection times out or credentials are not configured, all read and write transactions persist seamlessly without disruption.

---

## 2. Standard HTTP Response Codes

| Status Code | Meaning | Context / Usage |
| :--- | :--- | :--- |
| `200 OK` | Request Succeeded | Read queries (`GET`) and successful updates (`PUT`). |
| `201 Created` | Resource Created | Successful document creation (`POST`). |
| `204 No Content` | Handled Preflight | Successful `OPTIONS` CORS preflight response. |
| `400 Bad Request` | Validation Failure | Missing required fields, invalid types, or malformed JSON syntax. |
| `401 Unauthorized` | Invalid Credentials | Incorrect email or password during patron authentication. |
| `404 Not Found` | Resource Absent | Unknown route pathname or target document ID not found. |
| `409 Conflict` | Duplicate Resource | Registration attempt with an email that already exists. |
| `500 Server Error` | Internal Failure | Uncaught exception during database query or disk write. |

---

## 3. Customer Reviews & Ratings Module

Assigned to: **Khush Raghav**  
Route Controller: `backend/routes/reviewRoutes.js`  
Data Store: `backend/data/reviews.json` & `Review` Mongoose Model

### 3.1 Fetch Customer Reviews
Retrieves an array of all verified customer reviews and ratings ordered from newest to oldest.

- **Endpoint**: `GET /api/reviews/list`
- **Authentication**: None (Public)
- **Query Parameters**: None

#### Request Example
```bash
curl -X GET http://localhost:5000/api/reviews/list \
  -H "Accept: application/json"
```

#### Response Example (`200 OK`)
```json
[
  {
    "id": "rev-101",
    "name": "Delhi Gourmet Review",
    "dish": "Dal Bukhara & Malai Chaap",
    "rating": 5,
    "comment": "An extraordinary revelation in pure vegetarian fine dining. The Dal Bukhara rivals the royal kitchens in Asia.",
    "date": "2026-11-17T15:51:01.000Z"
  },
  {
    "id": "rev-102",
    "name": "Aditya & Meera Singhania",
    "dish": "Maharaja Indian Thali",
    "rating": 5,
    "comment": "The Maharaja Suite candlelight anniversary experience was sublime. Flawless hospitality and timeless ambiance.",
    "date": "2026-11-17T15:52:19.000Z"
  }
]
```

---

### 3.2 Submit New Review
Records a new customer testimonial and rating score. Sanitizes input values, prepends the record to disk, and triggers MongoDB replication when connected.

- **Endpoint**: `POST /api/reviews/new`
- **Authentication**: None (Public submission)
- **Request Headers**: `Content-Type: application/json`

#### Request Payload Schema
```json
{
  "name": "string (optional, defaults to 'Patron')",
  "dish": "string (optional, defaults to 'General Dining')",
  "rating": "number (required, integer between 1 and 5)",
  "comment": "string (required, user review commentary)"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/reviews/new \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kabir Mathur",
    "dish": "Saffron Handi Biryani",
    "rating": 5,
    "comment": "The subtle aroma of aged saffron and whole spices was unforgettable."
  }'
```

#### Response Example (`201 Created`)
```json
{
  "success": true,
  "message": "Review added successfully",
  "review": {
    "id": "rev-106",
    "name": "Kabir Mathur",
    "dish": "Saffron Handi Biryani",
    "rating": 5,
    "comment": "The subtle aroma of aged saffron and whole spices was unforgettable.",
    "date": "2026-11-19T11:45:00.000Z"
  }
}
```

---

## 4. Menu & Culinary Catalog Module

Assigned to: **Ashish Agrawal**  
Route Controller: `backend/server.js`  
Data Store: `backend/data/menu.json` & `Menu` Mongoose Model

### 4.1 Fetch Menu Catalog
Retrieves the complete catalog of royal vegetarian delicacies categorized by course and culinary traditions.

- **Endpoint**: `GET /api/menu/list`
- **Authentication**: None (Public)

#### Request Example
```bash
curl -X GET http://localhost:5000/api/menu/list \
  -H "Accept: application/json"
```

#### Response Example (`200 OK`)
```json
[
  {
    "id": "menu-01",
    "name": "Maharaja Indian Thali",
    "category": "Royal Feast",
    "price": 280,
    "description": "Grand platter of Paneer Butter Masala, Dal Makhani, Dum Pulao, Naan and Rose Lassi.",
    "image": "images/maharaja-thali.jpg",
    "isSignature": true
  },
  {
    "id": "menu-02",
    "name": "Malai Chaap",
    "category": "Royal Classic",
    "price": 180,
    "description": "Charcoal grilled soya skewers marinated in cultured cream, green cardamom and cashew paste.",
    "image": "images/malai-chaap.jpg",
    "isSignature": true
  }
]
```

---

## 5. Orders & Cart Transactions Module

Assigned to: **Ashish Agrawal**  
Route Controller: `backend/server.js`  
Data Store: `backend/data/orders.json` & `Order` Mongoose Model

### 5.1 Create Customer Order
Submits a cart checkout payload for takeaway or home delivery.

- **Endpoint**: `POST /api/orders/create`
- **Authentication**: None (Public / Patron)
- **Request Headers**: `Content-Type: application/json`

#### Request Payload Schema
```json
{
  "customerName": "string (required)",
  "customerEmail": "string (required, valid email address)",
  "phone": "string (required, mobile contact)",
  "deliveryAddress": "string (required)",
  "items": [
    {
      "id": "string (required, item menu identifier)",
      "name": "string (required)",
      "price": "number (required)",
      "quantity": "number (required, positive integer)"
    }
  ],
  "totalAmount": "number (required, total bill in INR)"
}
```

#### Response Example (`201 Created`)
```json
{
  "success": true,
  "message": "Order placed successfully",
  "orderId": "ORD-20261119-8924",
  "status": "confirmed"
}
```

---

## 6. Table Reservations Module

Assigned to: **Ashish Agrawal**  
Route Controller: `backend/server.js`  
Data Store: `backend/data/reservations.json` & `Reservation` Mongoose Model

### 6.1 Book a Dining Table
Books an exclusive table or private pavilion for lunch, high tea, or royal dinner service.

- **Endpoint**: `POST /api/reservations/book`
- **Authentication**: None (Public)
- **Request Headers**: `Content-Type: application/json`

#### Request Payload Schema
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "date": "string (required, format YYYY-MM-DD)",
  "time": "string (required, format HH:MM)",
  "guests": "number (required, 1 to 20)",
  "seatingArea": "string (e.g., 'Indoor Royal Court', 'Garden Pavilion', 'Rooftop Terrace')",
  "specialRequests": "string (optional dietary or celebration notes)"
}
```

#### Response Example (`201 Created`)
```json
{
  "success": true,
  "message": "Table reservation confirmed",
  "reservationId": "RES-2026-4412"
}
```

---

## 7. Patron Authentication & Account CRUD Module

Assigned to: **Shreya Chaudhary**  
Route Controller: `backend/routes/authRoutes.js`  
Data Store: `backend/data/users.json` & `User` Mongoose Model

### 7.1 Patron Registration
Creates a new patron account with unique email enforcement.

- **Endpoint**: `POST /api/auth/register`
- **Request Headers**: `Content-Type: application/json`

#### Request Payload Schema
```json
{
  "name": "string (required)",
  "email": "string (required, unique email)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Response Example (`201 Created`)
```json
{
  "success": true,
  "message": "Patron registered successfully",
  "user": {
    "id": "usr-84912",
    "name": "Rohan Deshmukh",
    "email": "rohan.deshmukh@example.com",
    "role": "patron"
  }
}
```

#### Error Example (`409 Conflict`)
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 7.2 Patron Sign-In / Login
Validates patron credentials and establishes user session context.

- **Endpoint**: `POST /api/auth/login`
- **Request Headers**: `Content-Type: application/json`

#### Request Payload Schema
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Response Example (`200 OK`)
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "usr-84912",
    "name": "Rohan Deshmukh",
    "email": "rohan.deshmukh@example.com",
    "role": "patron"
  }
}
```

---

### 7.3 Fetch Patron Profile
Retrieves account profile metadata by user ID.

- **Endpoint**: `GET /api/auth/profile?id={userId}`
- **Authentication**: Patron Session

#### Response Example (`200 OK`)
```json
{
  "success": true,
  "user": {
    "id": "usr-84912",
    "name": "Rohan Deshmukh",
    "email": "rohan.deshmukh@example.com",
    "role": "patron",
    "createdAt": "2026-11-14T16:15:00.000Z"
  }
}
```

---

## 8. Administrative Inquiries & Feedback Module

Assigned to: **Vivek Yadav**  
Route Controller: `backend/routes/contactRoutes.js`  
Data Store: `backend/data/contacts.json` & `Contact` Mongoose Model

### 8.1 List Contact Inquiries
Fetches customer contact messages with optional lifecycle status filtering.

- **Endpoint**: `GET /api/admin/contacts/list`
- **Query Parameters**:
  - `status` (optional): Filter inquiries by status (`all`, `pending`, `replied`, `archived`). Defaults to all.

#### Request Example
```bash
curl -X GET "http://localhost:5000/api/admin/contacts/list?status=pending" \
  -H "Accept: application/json"
```

#### Response Example (`200 OK`)
```json
{
  "total": 3,
  "inquiries": [
    {
      "id": "inq-201",
      "name": "Vikram Rathore",
      "email": "vikram.rathore@example.com",
      "subject": "Private Banquet Hall Booking",
      "message": "Inquiring about booking the Royal Durbar hall for an anniversary gala of 80 guests on December 12th.",
      "status": "pending",
      "createdAt": "2026-11-18T14:49:08.000Z"
    }
  ]
}
```

---

### 8.2 Update Inquiry Lifecycle Status
Updates an inquiry state from `pending` to `replied` or `archived`.

- **Endpoint**: `POST /api/admin/contacts/status`
- **Request Headers**: `Content-Type: application/json`

#### Request Payload Schema
```json
{
  "id": "string (required, inquiry identifier)",
  "status": "string (required: 'pending' | 'replied' | 'archived')"
}
```

#### Response Example (`200 OK`)
```json
{
  "success": true,
  "message": "Status updated",
  "inquiry": {
    "id": "inq-201",
    "status": "replied",
    "updatedAt": "2026-11-19T11:55:00.000Z"
  }
}
```

---

## 9. Error Handling & Debugging Best Practices

1. **Verify Server Port**: If port `5000` is already in use by another daemon, the server automatically attempts fallback increments (`5001`, `5002`) and prints the active listening port in the terminal.
2. **Inspect JSON Data Files**: Verify that `backend/data/*.json` files contain valid JSON arrays without dangling commas or trailing syntax errors.
3. **MongoDB Connectivity**: Set `MONGO_URI` in `.env` to a valid MongoDB connection string. If omitted, the server operates in robust JSON fallback mode without throwing runtime errors.
