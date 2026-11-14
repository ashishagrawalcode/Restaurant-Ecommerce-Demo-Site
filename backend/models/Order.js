// Order.js - MongoDB schema for Orders
// ashish task: Order Management

const orderSchema = {
  orderRef: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  subtotal: Number,
  discount: Number,
  delivery: Number,
  tax: Number,
  total: Number,
  status: { type: String, default: 'placed' }, // placed, preparing, delivered, cancelled
  notes: String,
  createdAt: { type: Date, default: Date.now }
};

module.exports = orderSchema;
