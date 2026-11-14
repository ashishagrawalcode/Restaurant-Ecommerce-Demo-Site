// Contact.js - MongoDB schema for Inquiries
// vivek task: Inquiry Management

const contactSchema = {
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending, replied, archived
  createdAt: { type: Date, default: Date.now }
};

module.exports = contactSchema;
