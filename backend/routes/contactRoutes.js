// contactRoutes.js - Contact & Inquiries Admin Management
// Assigned to: Vivek Yadav
// Task: Handle contact inquiry filtering, status updates, and admin viewing

module.exports = {
  async handle(req, res, pathname, method, body, helpers) {
    const { readJson, writeJson, sendJson, isConnected, getModels } = helpers;
    const models = getModels ? getModels() : {};
    const useMongo = isConnected && isConnected() && models.Contact;

    // GET /api/admin/contacts/list - view all inquiries with optional status filter
    if (pathname === '/api/admin/contacts/list' && method === 'GET') {
      try {
        let contacts = readJson('contacts.json');

        // Parse optional status filter from query parameters (?status=pending / ?status=all)
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const statusFilter = parsedUrl.searchParams.get('status');

        if (statusFilter && statusFilter.trim() !== '' && statusFilter.toLowerCase() !== 'all') {
          const target = statusFilter.trim().toLowerCase();
          contacts = contacts.filter(c => (c.status || 'pending').toLowerCase() === target);
        }

        return sendJson(res, 200, {
          total: contacts.length,
          inquiries: contacts
        });
      } catch (err) {
        console.error('Error fetching admin contacts:', err);
        return sendJson(res, 500, { success: false, message: 'Failed to load inquiries' });
      }
    }

    // POST /api/admin/contacts/status - update inquiry status (e.g., replied, reviewed)
    if (pathname === '/api/admin/contacts/status' && method === 'POST') {
      const { id, status } = body;

      if (!id) {
        return sendJson(res, 400, { success: false, message: 'Inquiry ID is required' });
      }

      const contacts = readJson('contacts.json');
      const item = contacts.find(c => c.id === id);
      if (!item) {
        return sendJson(res, 404, { success: false, message: 'Inquiry not found' });
      }

      // Update status to "replied" or "reviewed" or specified status
      item.status = status || 'replied';
      item.updatedAt = new Date().toISOString();
      writeJson('contacts.json', contacts);

      // Optionally sync to MongoDB if connected
      if (useMongo) {
        try {
          await models.Contact.findOneAndUpdate({ id }, { status: item.status });
        } catch (e) {
          console.error('Mongo contact status update error:', e.message);
        }
      }

      return sendJson(res, 200, {
        success: true,
        message: 'Status updated',
        inquiry: item,
        item
      });
    }

    sendJson(res, 404, { error: 'Contact admin route not found' });
  }
};
