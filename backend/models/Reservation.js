// Reservation.js - MongoDB schema for Table Bookings
// ashish task: Table Reservations

const reservationSchema = {
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seating: { type: String, default: 'Standard Table' },
  occasion: { type: String, default: 'Dining' },
  status: { type: String, default: 'confirmed' }, // confirmed, completed, cancelled
  createdAt: { type: Date, default: Date.now }
};

module.exports = reservationSchema;
