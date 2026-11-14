// contactRoutes.js - Contact & Inquiries Admin Management
// Assigned to: Vivek Yadav
// Task: Handle contact inquiry filtering, status updates, and admin viewing

module.exports = {
  handle(req, res, pathname, method, body, helpers) {
    const { readJson, writeJson, sendJson } = helpers;

    // GET /api/admin/contacts/list - view all inquiries with optional filter
    if (pathname === '/api/admin/contacts/list' && method === 'GET') {
      const contacts = readJson('contacts.json');
      return sendJson(res, 200, {
        total: contacts.length,
        inquiries: contacts
      });
    }

    // POST /api/admin/contacts/status - update inquiry status (e.g., replied, pending)
    if (pathname === '/api/admin/contacts/status' && method === 'POST') {
      const contacts = readJson('contacts.json');
      const { id, status } = body;

      const item = contacts.find(c => c.id === id);
      if (!item) {
        return sendJson(res, 404, { success: false, message: 'Inquiry not found' });
      }

      item.status = status || 'reviewed';
      writeJson('contacts.json', contacts);

      return sendJson(res, 200, { success: true, message: 'Status updated', item });
    }

    sendJson(res, 404, { error: 'Contact admin route not found' });
  }
};
