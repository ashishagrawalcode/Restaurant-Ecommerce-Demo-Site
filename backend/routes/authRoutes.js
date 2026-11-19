/**
 * @file authRoutes.js
 * @description Authentication & Patron Account Management routes.
 * Provides endpoints for patron registration, credential verification, profile inspection,
 * account credentials update, and patron account deletion.
 */

module.exports = {
  /**
   * Request dispatcher for authentication and patron management routes.
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
    const useMongo = isConnected && isConnected() && models.User;

    // 1. POST /api/auth/register - new patron sign up (CREATE)
    if (pathname === '/api/auth/register' && method === 'POST') {
      const { name, email, password } = body;

      if (!email || !password) {
        return sendJson(res, 400, { success: false, message: 'Email and password are required' });
      }

      // check duplicate email in MongoDB or JSON
      if (useMongo) {
        try {
          const existing = await models.User.findOne({ email });
          if (existing) {
            return sendJson(res, 409, { success: false, message: 'Email already registered' });
          }
        } catch (e) {
          console.error('Mongo register check error:', e.message);
        }
      }

      const users = readJson('users.json');
      if (users.some(u => u.email === email)) {
        return sendJson(res, 409, { success: false, message: 'Email already registered' });
      }

      const newUser = {
        id: 'usr-' + Date.now().toString().slice(-5),
        name: name || 'Royal Patron',
        email,
        password,
        role: 'patron',
        createdAt: new Date()
      };

      // save to MongoDB
      if (useMongo) {
        try {
          await models.User.create(newUser);
        } catch (e) {
          console.error('Mongo user create error:', e.message);
        }
      }

      // save to JSON file backup
      users.push(newUser);
      writeJson('users.json', users);

      return sendJson(res, 201, {
        success: true,
        message: 'Account registered successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }

    // 2. POST /api/auth/login - patron sign in (READ / VERIFY)
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { email, password } = body;

      let user = null;

      if (useMongo) {
        try {
          user = await models.User.findOne({ email, password }).lean();
        } catch (e) {
          console.error('Mongo login check error:', e.message);
        }
      }

      if (!user) {
        const users = readJson('users.json');
        user = users.find(u => u.email === email && u.password === password);
      }

      if (!user) {
        return sendJson(res, 401, { success: false, message: 'Invalid email or password' });
      }

      return sendJson(res, 200, {
        success: true,
        message: 'Signed in successfully',
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }

    // 3. GET /api/auth/users - list all patrons (READ)
    if (pathname === '/api/auth/users' && method === 'GET') {
      if (useMongo) {
        try {
          const list = await models.User.find({}, '-password').lean();
          return sendJson(res, 200, list);
        } catch (e) {
          console.error('Mongo get users error:', e.message);
        }
      }
      const users = readJson('users.json');
      const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
      return sendJson(res, 200, safeUsers);
    }

    // 4. PUT /api/auth/profile - update patron profile (UPDATE)
    if (pathname === '/api/auth/profile' && method === 'PUT') {
      const { email, name, password } = body;
      if (!email) {
        return sendJson(res, 400, { success: false, message: 'User email required for update' });
      }

      let updated = null;
      const updateData = {};
      if (name) updateData.name = name;
      if (password) updateData.password = password;

      if (useMongo) {
        try {
          updated = await models.User.findOneAndUpdate({ email }, updateData, { new: true }).lean();
        } catch (e) {
          console.error('Mongo profile update error:', e.message);
        }
      }

      const users = readJson('users.json');
      const idx = users.findIndex(u => u.email === email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updateData };
        writeJson('users.json', users);
        if (!updated) updated = users[idx];
      }

      if (!updated) {
        return sendJson(res, 404, { success: false, message: 'User not found' });
      }

      return sendJson(res, 200, {
        success: true,
        message: 'Profile updated successfully',
        user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role }
      });
    }

    // 5. DELETE /api/auth/account/:id - remove patron account (DELETE)
    if (pathname.startsWith('/api/auth/account') && method === 'DELETE') {
      const id = pathname.replace('/api/auth/account', '').replace(/^\//, '');
      if (!id) {
        return sendJson(res, 400, { success: false, message: 'Account ID or email required' });
      }

      if (useMongo) {
        try {
          await models.User.findOneAndDelete({ $or: [{ id }, { email: id }] });
        } catch (e) {
          console.error('Mongo delete user error:', e.message);
        }
      }

      const users = readJson('users.json');
      const filtered = users.filter(u => u.id !== id && u.email !== id);
      writeJson('users.json', filtered);

      return sendJson(res, 200, { success: true, message: 'Account deleted successfully' });
    }

    // Fallback for unknown sub-route
    sendJson(res, 404, { error: 'Auth route not found' });
  }
};
