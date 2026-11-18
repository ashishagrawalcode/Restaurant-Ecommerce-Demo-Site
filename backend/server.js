// server.js - main backend server for The Saffron Plate
// Built by Ashish Agrawal

const http = require('http');
const fs = require('fs');
const path = require('path');

// load environment variables from .env
const loadEnv = require('./config/env');
loadEnv();

// database connection setup (mongodb with json fallback)
const { connectDB, getDbStatus, isConnected, getModels } = require('./config/db');
connectDB();

// import route modules for teammates
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const PORT = process.env.PORT || 5000;
const FRONTEND_DIR = path.join(__dirname, '../frontend');
const DATA_DIR = path.join(__dirname, 'data');

// helper: read json file
function readJson(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error('Error reading ' + filename, err);
    return [];
  }
}

// helper: write json file
function writeJson(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing ' + filename, err);
    return false;
  }
}

// helper: send json response
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

// helper: read post and put body
function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// mime types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// create http server
const server = http.createServer(async (req, res) => {
  // handle cors preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // read json body if post or put request
  const body = (method === 'POST' || method === 'PUT') ? await getRequestBody(req) : {};

  // ==========================================
  // ASHISH'S CORE EVALUATION API ROUTES (CRUD)
  // ==========================================

  // 1. health and database status check
  if (pathname === '/api/health') {
    return sendJson(res, 200, {
      status: 'ok',
      database: getDbStatus(),
      time: new Date()
    });
  }

  // 2. menu crud (read all, read one, create, update, delete)
  if (pathname === '/api/menu' || pathname.startsWith('/api/menu/')) {
    const menu = readJson('menu.json');
    const id = pathname.replace('/api/menu', '').replace(/^\//, '');

    // READ all
    if (method === 'GET' && !id) {
      return sendJson(res, 200, menu);
    }
    // READ single item
    if (method === 'GET' && id) {
      const item = menu.find(m => m.id === id);
      return item ? sendJson(res, 200, item) : sendJson(res, 404, { error: 'Dish not found' });
    }
    // CREATE new item
    if (method === 'POST') {
      const newItem = {
        id: body.id || ('dish-' + Date.now().toString().slice(-4)),
        name: body.name || 'New Dish',
        category: body.category || 'royal-classics',
        price: Number(body.price) || 100,
        tags: body.tags || [],
        image: body.image || 'images/hero_dish.jpg',
        badge: body.badge || 'Chef Special',
        description: body.description || ''
      };
      menu.push(newItem);
      writeJson('menu.json', menu);
      return sendJson(res, 201, { success: true, message: 'Dish added', item: newItem });
    }
    // UPDATE item
    if (method === 'PUT' && id) {
      const idx = menu.findIndex(m => m.id === id);
      if (idx === -1) return sendJson(res, 404, { error: 'Dish not found' });
      menu[idx] = { ...menu[idx], ...body, id };
      writeJson('menu.json', menu);
      return sendJson(res, 200, { success: true, message: 'Dish updated', item: menu[idx] });
    }
    // DELETE item
    if (method === 'DELETE' && id) {
      const filtered = menu.filter(m => m.id !== id);
      if (filtered.length === menu.length) return sendJson(res, 404, { error: 'Dish not found' });
      writeJson('menu.json', filtered);
      return sendJson(res, 200, { success: true, message: 'Dish deleted' });
    }
  }

  // 3. orders crud (read all, read one, create, update status, delete/cancel)
  if (pathname === '/api/orders' || pathname.startsWith('/api/orders/')) {
    const orders = readJson('orders.json');
    const id = pathname.replace('/api/orders', '').replace(/^\//, '');

    // READ all orders
    if (method === 'GET' && !id) {
      return sendJson(res, 200, orders);
    }
    // READ single order
    if (method === 'GET' && id) {
      const order = orders.find(o => o.orderRef === id || o.orderId === id);
      return order ? sendJson(res, 200, order) : sendJson(res, 404, { error: 'Order not found' });
    }
    // CREATE order
    if (method === 'POST') {
      const newOrder = {
        orderRef: body.orderId || body.orderRef || ('ORD-' + Date.now().toString().slice(-6)),
        customer: body.customer || { name: 'Guest Patron' },
        items: body.items || [],
        subtotal: body.subtotal || (body.bill ? body.bill.subtotal : 0),
        discount: body.discount || (body.bill ? body.bill.discount : 0),
        delivery: body.delivery || (body.bill ? body.bill.deliveryFee : 0),
        tax: body.tax || (body.bill ? body.bill.taxGst : 0),
        total: body.total || (body.bill ? body.bill.totalPaid : 0),
        status: 'placed',
        notes: body.notes || '',
        createdAt: new Date().toISOString()
      };
      orders.unshift(newOrder);
      writeJson('orders.json', orders);
      return sendJson(res, 201, { success: true, message: 'Order placed', order: newOrder });
    }
    // UPDATE order status
    if (method === 'PUT' && id) {
      const idx = orders.findIndex(o => o.orderRef === id || o.orderId === id);
      if (idx === -1) return sendJson(res, 404, { error: 'Order not found' });
      orders[idx] = { ...orders[idx], ...body };
      writeJson('orders.json', orders);
      return sendJson(res, 200, { success: true, message: 'Order updated', order: orders[idx] });
    }
    // DELETE / cancel order
    if (method === 'DELETE' && id) {
      const filtered = orders.filter(o => o.orderRef !== id && o.orderId !== id);
      if (filtered.length === orders.length) return sendJson(res, 404, { error: 'Order not found' });
      writeJson('orders.json', filtered);
      return sendJson(res, 200, { success: true, message: 'Order deleted' });
    }
  }

  // 4. reservations crud (read all, read one, create, update, delete)
  if (pathname === '/api/reservations' || pathname.startsWith('/api/reservations/')) {
    const reservations = readJson('reservations.json');
    const id = pathname.replace('/api/reservations', '').replace(/^\//, '');

    // READ all
    if (method === 'GET' && !id) {
      return sendJson(res, 200, reservations);
    }
    // READ single reservation
    if (method === 'GET' && id) {
      const resv = reservations.find(r => r.id === id);
      return resv ? sendJson(res, 200, resv) : sendJson(res, 404, { error: 'Reservation not found' });
    }
    // CREATE reservation
    if (method === 'POST') {
      const newRes = {
        id: body.id || ('res-' + Date.now().toString().slice(-6)),
        name: body.guestName || body.name || 'Guest',
        phone: body.guestPhone || body.phone || '',
        guests: body.partySize || body.guests || '2 Guests',
        date: body.reservationDate || body.date || '',
        time: body.timeSlot || body.time || '',
        seating: body.seatingSpace || body.seating || 'Standard Table',
        occasion: body.diningOccasion || body.occasion || 'Dining',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      reservations.unshift(newRes);
      writeJson('reservations.json', reservations);
      return sendJson(res, 201, { success: true, message: 'Table reserved', reservation: newRes });
    }
    // UPDATE reservation
    if (method === 'PUT' && id) {
      const idx = reservations.findIndex(r => r.id === id);
      if (idx === -1) return sendJson(res, 404, { error: 'Reservation not found' });
      reservations[idx] = { ...reservations[idx], ...body, id };
      writeJson('reservations.json', reservations);
      return sendJson(res, 200, { success: true, message: 'Reservation updated', reservation: reservations[idx] });
    }
    // DELETE reservation
    if (method === 'DELETE' && id) {
      const filtered = reservations.filter(r => r.id !== id);
      if (filtered.length === reservations.length) return sendJson(res, 404, { error: 'Reservation not found' });
      writeJson('reservations.json', filtered);
      return sendJson(res, 200, { success: true, message: 'Reservation cancelled' });
    }
  }

  // 5. contact inquiries api (ashish base)
  if (pathname === '/api/contact') {
    if (method === 'GET') {
      const contacts = readJson('contacts.json');
      return sendJson(res, 200, contacts);
    }
    if (method === 'POST') {
      const contacts = readJson('contacts.json');
      const newMsg = {
        id: 'msg-' + Date.now().toString().slice(-6),
        name: body.name || 'Anonymous',
        email: body.email || '',
        subject: body.subject || 'General Inquiry',
        message: body.message || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      contacts.unshift(newMsg);
      writeJson('contacts.json', contacts);
      return sendJson(res, 201, { success: true, message: 'Message saved', inquiry: newMsg });
    }
  }

  // ==========================================
  // TEAMMATE ROUTE MODULES
  // ==========================================

  // Shreya: Auth routes (/api/auth/*)
  if (pathname.startsWith('/api/auth')) {
    if (authRoutes && typeof authRoutes.handle === 'function') {
      return authRoutes.handle(req, res, pathname, method, body, { readJson, writeJson, sendJson, isConnected, getModels });
    }
  }

  // Vivek: Contact inquiries admin routes (/api/admin/contacts/*)
  if (pathname.startsWith('/api/admin/contacts')) {
    if (contactRoutes && typeof contactRoutes.handle === 'function') {
      return contactRoutes.handle(req, res, pathname, method, body, { readJson, writeJson, sendJson, isConnected, getModels });
    }
  }

  // Khush: Reviews & Ratings routes (/api/reviews/*)
  if (pathname.startsWith('/api/reviews')) {
    if (reviewRoutes && typeof reviewRoutes.handle === 'function') {
      return reviewRoutes.handle(req, res, pathname, method, body, { readJson, writeJson, sendJson, isConnected, getModels });
    }
  }

  // ==========================================
  // STATIC FILE SERVER (serves ../frontend)
  // ==========================================
  let filePath = path.join(FRONTEND_DIR, pathname === '/' ? 'index.html' : pathname);

  // if path not found directly, check inside pages/ folder
  if (!fs.existsSync(filePath)) {
    const pageAttempt = path.join(FRONTEND_DIR, 'pages', pathname.replace(/^\//, ''));
    if (fs.existsSync(pageAttempt)) {
      filePath = pageAttempt;
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

// start server with graceful fallback if default port is in use (e.g. macOS AirPlay Receiver)
let currentPort = Number(PORT);

function startServer(portToListen) {
  server.listen(portToListen);
}

server.on('listening', () => {
  const address = server.address();
  const actualPort = typeof address === 'string' ? address : address.port;
  console.log(`\n==================================================`);
  console.log(`👑 The Saffron Plate Server Running`);
  console.log(`🌐 Local Website URL: http://localhost:${actualPort}`);
  console.log(`📁 Serving frontend from: ${FRONTEND_DIR}`);
  console.log(`📑 Staff Portal: http://localhost:${actualPort}/pages/admin-inquiries.html`);
  console.log(`==================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = currentPort === 5000 ? 5001 : currentPort + 1;
    console.warn(`[WARN] Port ${currentPort} is currently occupied (macOS AirPlay Receiver occupies port 5000).`);
    console.log(`[INFO] Automatically retrying on available port: http://localhost:${nextPort}...`);
    currentPort = nextPort;
    setTimeout(() => startServer(nextPort), 250);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);
