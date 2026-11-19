/**
 * @file contactRoutes.js
 * @description Contact inquiries administration route handlers.
 * Handles inquiry retrieval with status filtering and lifecycle updates (pending, replied, archived).
 */
module.exports = {
  /**
   * Request dispatcher for administrative contact inquiry routes.
   * @param {import('http').IncomingMessage} req - Incoming request.
   * @param {import('http').ServerResponse} res - Server response.
   * @param {string} pathname - Parsed endpoint path.
   * @param {string} method - HTTP request method.
   * @param {Object} body - Parsed JSON body.
   * @param {Object} helpers - Shared server persistence and formatting utilities.
   * @returns {Promise<void>}
   */
  async handle(req, res, pathname, method, body, helpers) {
    const { readJson, writeJson, sendJson, isConnected, getModels } = helpers;
    const models = getModels ? getModels() : {};
    const useMongo = isConnected && isConnected() && models.Contact;

    // get inquiries list with optional status filter
    if (pathname === '/api/admin/contacts/list' && method === 'GET') {
      try {
        let contacts = readJson('contacts.json');

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

    // update inquiry status
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

      item.status = status || 'replied';
      item.updatedAt = new Date().toISOString();
      writeJson('contacts.json', contacts);

      // sync to mongodb if connected
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
