# The Saffron Plate - Data Dictionary & Database Schema Specification

This document provides the definitive data dictionary and database schema specification for **The Saffron Plate** fullstack restaurant web application. It specifies data types, validation constraints, default values, indexing strategies, and JSON document structures for all six core domain entities.

---

## 1. Storage Architecture Overview

The application utilizes a **hybrid dual-store storage architecture**:
- **MongoDB Database**: Document-oriented database hosted via MongoDB Atlas or local `mongod` service, managed through Mongoose schemas compiled in `backend/config/db.js`.
- **Flat-File JSON Store**: Local filesystem fallback database stored in `backend/data/*.json`. When MongoDB is not configured or in offline environments, read and write operations are routed to these structured JSON collections.

```
                    ┌─────────────────────────┐
                    │      HTTP Request       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Route Controller    │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
    ┌───────────────────┐                 ┌───────────────────┐
    │  Flat-File Store  │                 │  MongoDB Cluster  │
    │  (data/*.json)    │                 │  (Mongoose Model) │
    │  * Always Written │                 │  * Async Replicate│
    └───────────────────┘                 └───────────────────┘
```

---

## 2. Model 1: Customer Review (`Review`)

- **Domain Owner**: Khush Raghav
- **Mongoose Schema**: `backend/models/Review.js`
- **Flat-File Store**: `backend/data/reviews.json`
- **Purpose**: Stores verified patron testimonials, star ratings, and dish feedback.

### 2.1 Field Definitions

| Field Name | Data Type | Required | Unique | Default Value | Constraints & Validation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `String` | Yes | Yes | None | Primary identifier format: `rev-{number}` (e.g. `rev-101`) |
| `name` | `String` | Yes | No | `'Patron'` | Customer display name, trimmed, non-empty |
| `dish` | `String` | No | No | `'General Dining'` | Specific culinary item or dining event |
| `rating` | `Number` | Yes | No | `5` | Integer clamped between `1` (minimum) and `5` (maximum) |
| `comment` | `String` | Yes | No | None | Customer review quotation text |
| `createdAt` | `Date` | No | No | `Date.now` | ISO 8601 creation timestamp |

### 2.2 Sample Document
```json
{
  "id": "rev-101",
  "name": "Delhi Gourmet Review",
  "dish": "Dal Bukhara & Malai Chaap",
  "rating": 5,
  "comment": "An extraordinary revelation in pure vegetarian fine dining. The Dal Bukhara and Malai Chaap rival the best royal kitchens in Asia.",
  "createdAt": "2026-11-17T15:51:01.000Z"
}
```

---

## 3. Model 2: Culinary Menu Item (`Menu`)

- **Domain Owner**: Ashish Agrawal
- **Mongoose Schema**: `backend/models/Menu.js`
- **Flat-File Store**: `backend/data/menu.json`
- **Purpose**: Master restaurant catalog of royal vegetarian dishes, beverages, and desserts.

### 3.1 Field Definitions

| Field Name | Data Type | Required | Unique | Default Value | Constraints & Validation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `String` | Yes | Yes | None | Catalog identifier (e.g. `menu-01`, `menu-02`) |
| `name` | `String` | Yes | No | None | Display dish name in Romanized Hindi/English |
| `category` | `String` | Yes | No | `'Chef Special'` | Category grouping (Royal Feast, Royal Classic, Artisan Ramen, etc.) |
| `price` | `Number` | Yes | No | `0` | Price denominated in Indian Rupees (INR), minimum `0` |
| `description`| `String` | Yes | No | None | Ingredients, preparation style, and heritage notes |
| `image` | `String` | No | No | `'images/default-dish.jpg'` | Relative path to high-resolution asset |
| `isSignature`| `Boolean`| No | No | `false` | Highlight flag for homepage culinary showcase |
| `dietary` | `Array` | No | No | `["Pure Vegetarian"]` | Dietary labels (e.g. Jain, Vegan, Gluten-Free) |

### 3.2 Sample Document
```json
{
  "id": "menu-01",
  "name": "Maharaja Indian Thali",
  "category": "Royal Feast",
  "price": 280,
  "description": "Grand platter of Paneer Butter Masala, Dal Makhani, Dum Pulao, Naan and Rose Lassi.",
  "image": "images/maharaja-thali.jpg",
  "isSignature": true,
  "dietary": ["Pure Vegetarian", "Royal Heritage"]
}
```

---

## 4. Model 3: Patron Order (`Order`)

- **Domain Owner**: Ashish Agrawal
- **Mongoose Schema**: `backend/models/Order.js`
- **Flat-File Store**: `backend/data/orders.json`
- **Purpose**: Records customer online food orders, line items, and delivery status.

### 4.1 Field Definitions

| Field Name | Data Type | Required | Default Value | Constraints & Validation |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `String` | Yes | None | Unique transaction reference (e.g. `ORD-20261119-104`) |
| `customerName` | `String` | Yes | None | Recipient full name |
| `customerEmail`| `String` | Yes | None | Recipient contact email |
| `phone` | `String` | Yes | None | Recipient 10-digit mobile number |
| `deliveryAddress`| `String` | Yes | None | Complete street address, apartment, and landmark |
| `items` | `Array` | Yes | `[]` | Array of ordered sub-documents with quantity and price |
| `totalAmount` | `Number` | Yes | `0` | Calculated order total sum in INR |
| `status` | `String` | No | `'received'` | Enum: `received`, `preparing`, `out-for-delivery`, `completed` |
| `createdAt` | `Date` | No | `Date.now` | Order placement timestamp |

### 4.2 Sample Document
```json
{
  "id": "ORD-20261119-104",
  "customerName": "Simran Kapoor",
  "customerEmail": "simran.kapoor@example.com",
  "phone": "+91 98765 43210",
  "deliveryAddress": "Penthouse 14B, Heritage Heights, Golf Course Road, Gurugram",
  "items": [
    { "id": "menu-01", "name": "Maharaja Indian Thali", "price": 280, "quantity": 2 },
    { "id": "menu-11", "name": "Rasmalai", "price": 90, "quantity": 4 }
  ],
  "totalAmount": 920,
  "status": "received",
  "createdAt": "2026-11-19T10:15:00.000Z"
}
```

---

## 5. Model 4: Table Reservation (`Reservation`)

- **Domain Owner**: Ashish Agrawal
- **Mongoose Schema**: `backend/models/Reservation.js`
- **Flat-File Store**: `backend/data/reservations.json`
- **Purpose**: Manages dining room reservations, guest counts, and seating assignments.

### 5.1 Field Definitions

| Field Name | Data Type | Required | Default Value | Constraints & Validation |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `String` | Yes | None | Reservation reference (e.g. `RES-2026-4412`) |
| `name` | `String` | Yes | None | Dining party host name |
| `email` | `String` | Yes | None | Host confirmation email |
| `phone` | `String` | Yes | None | Host contact telephone |
| `date` | `String` | Yes | None | Date formatted as `YYYY-MM-DD` |
| `time` | `String` | Yes | None | Time formatted as `HH:MM` |
| `guests` | `Number` | Yes | `2` | Integer between `1` and `20` persons |
| `seatingArea` | `String` | No | `'Royal Court'` | Enum: `Royal Court`, `Garden Pavilion`, `Candlelight Suite` |
| `specialRequests`| `String` | No | `''` | Dietary restrictions, cake orders, anniversary notes |
| `status` | `String` | No | `'confirmed'` | Enum: `pending`, `confirmed`, `seated`, `cancelled` |
| `createdAt` | `Date` | No | `Date.now` | Booking submission timestamp |

### 5.2 Sample Document
```json
{
  "id": "RES-2026-4412",
  "name": "Devendra Singhal",
  "email": "devendra.singhal@example.com",
  "phone": "+91 99100 11223",
  "date": "2026-11-25",
  "time": "20:00",
  "guests": 6,
  "seatingArea": "Garden Pavilion",
  "specialRequests": "Jain preparation preferred for 2 guests; anniversary table decor.",
  "status": "confirmed",
  "createdAt": "2026-11-19T09:30:00.000Z"
}
```

---

## 6. Model 5: Contact Inquiry (`Contact`)

- **Domain Owner**: Vivek Yadav
- **Mongoose Schema**: `backend/models/Contact.js`
- **Flat-File Store**: `backend/data/contacts.json`
- **Purpose**: Stores customer service messages, catering inquiries, and feedback.

### 6.1 Field Definitions

| Field Name | Data Type | Required | Default Value | Constraints & Validation |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `String` | Yes | None | Inquiry identifier format: `inq-{number}` |
| `name` | `String` | Yes | None | Sender name |
| `email` | `String` | Yes | None | Sender email |
| `subject` | `String` | No | `'General Inquiry'` | Inquiry subject |
| `message` | `String` | Yes | None | Full message body |
| `status` | `String` | No | `'pending'` | Enum: `pending`, `replied`, `archived` |
| `createdAt` | `Date` | No | `Date.now` | Submission timestamp |
| `updatedAt` | `Date` | No | None | Resolution timestamp |

### 6.2 Sample Document
```json
{
  "id": "inq-201",
  "name": "Vikram Rathore",
  "email": "vikram.rathore@example.com",
  "subject": "Private Banquet Hall Booking",
  "message": "Inquiring about booking the Royal Durbar hall for an anniversary gala of 80 guests on December 12th.",
  "status": "pending",
  "createdAt": "2026-11-18T14:49:08.000Z"
}
```

---

## 7. Model 6: Patron User Account (`User`)

- **Domain Owner**: Shreya Chaudhary
- **Mongoose Schema**: `backend/models/User.js`
- **Flat-File Store**: `backend/data/users.json`
- **Purpose**: Manages patron credentials, registration timestamps, and authorization roles.

### 7.1 Field Definitions

| Field Name | Data Type | Required | Unique | Default Value | Constraints & Validation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `String` | Yes | Yes | None | Account reference: `usr-{timestamp}` |
| `name` | `String` | Yes | No | `'Royal Patron'` | Full name, trimmed |
| `email` | `String` | Yes | Yes | None | Lowercase, unique, valid email format |
| `password` | `String` | Yes | No | None | Minimum length of 6 characters |
| `role` | `String` | No | No | `'patron'` | Enum: `patron`, `admin` |
| `createdAt` | `Date` | No | No | `Date.now` | Registration timestamp |

### 7.2 Sample Document
```json
{
  "id": "usr-84912",
  "name": "Rohan Deshmukh",
  "email": "rohan.deshmukh@example.com",
  "password": "hashed_credentials_string",
  "role": "patron",
  "createdAt": "2026-11-14T16:15:00.000Z"
}
```
