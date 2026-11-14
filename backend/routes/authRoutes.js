// authRoutes.js - Authentication & User Session Module
// Assigned to: Shreya Chaudhary
// Task: Handle user login, registration, and session info

module.exports = {
  handle(req, res, pathname, method, body, helpers) {
    const { readJson, writeJson, sendJson } = helpers;

    // POST /api/auth/login - user sign in
    if (pathname === '/api/auth/login' && method === 'POST') {
      const users = readJson('users.json');
      const { email, password } = body;

      // check if user exists
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return sendJson(res, 401, { success: false, message: 'Invalid email or password' });
      }

      // return safe user data without password
      return sendJson(res, 200, {
        success: true,
        message: 'Signed in successfully',
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }

    // POST /api/auth/register - new patron registration
    if (pathname === '/api/auth/register' && method === 'POST') {
      const users = readJson('users.json');
      const { name, email, password } = body;

      if (!email || !password) {
        return sendJson(res, 400, { success: false, message: 'Email and password required' });
      }

      // check for duplicate
      if (users.some(u => u.email === email)) {
        return sendJson(res, 409, { success: false, message: 'Email already registered' });
      }

      const newUser = {
        id: 'usr-' + Date.now().toString().slice(-5),
        name: name || 'Patron',
        email,
        password,
        role: 'patron'
      };

      users.push(newUser);
      writeJson('users.json', users);

      return sendJson(res, 201, {
        success: true,
        message: 'Account registered successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    }

    // fallback for unknown auth route
    sendJson(res, 404, { error: 'Auth route not found' });
  }
};
