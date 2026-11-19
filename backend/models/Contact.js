/**
 * @file Contact.js
 * @description Mongoose schema definition for Contact Inquiries.
 * Stores customer inquiries, messages, status lifecycle, and submission timestamps.
 */

/**
 * Contact inquiry schema definition.
 * @typedef {Object} ContactDefinition
 * @property {string} id - Unique inquiry identifier.
 * @property {string} name - Contact sender name.
 * @property {string} email - Contact sender email address.
 * @property {string} subject - Inquiry subject or reason for message.
 * @property {string} message - Inquiry content body.
 * @property {'pending'|'replied'|'archived'} status - Inquiry processing state.
 * @property {Date} createdAt - Timestamp of inquiry submission.
 */
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
