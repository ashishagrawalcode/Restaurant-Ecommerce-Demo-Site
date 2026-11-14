// Menu.js - MongoDB schema for Menu Items
// ashish task: Menu Catalog CRUD

const menuSchema = {
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  tags: [String],
  image: String,
  badge: String,
  description: String,
  available: { type: Boolean, default: true }
};

module.exports = menuSchema;
