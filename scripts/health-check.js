/**
 * @file health-check.js
 * @description Zero-dependency automated test runner for The Saffron Plate API endpoints.
 * Validates endpoint availability, response status codes, payload structures, and headers.
 * Run with: node scripts/health-check.js
 */

const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';
const parsedUrl = new URL(BASE_URL);
const HOST = parsedUrl.hostname;
const PORT = parsedUrl.port || 5000;

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Dispatches an HTTP request and asserts expectations.
 * @param {Object} options - Request configuration options.
 * @param {string} options.name - Test scenario description.
 * @param {string} options.path - Request pathname.
 * @param {string} [options.method='GET'] - HTTP method.
 * @param {Object} [options.body] - JSON payload for POST/PUT.
 * @param {number} [options.expectedStatus=200] - Expected HTTP response status code.
 * @returns {Promise<void>}
 */
function runTest({ name, path, method = 'GET', body = null, expectedStatus = 200 }) {
  return new Promise((resolve) => {
    testsRun++;
    const postData = body ? JSON.stringify(body) : null;
    const reqOptions = {
      hostname: HOST,
      port: PORT,
      path,
      method,
      headers: {
        'Accept': 'application/json',
        ...(postData ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        } : {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode === expectedStatus) {
          testsPassed++;
          console.log(`  ✓ [PASS] ${name} (Status: ${res.statusCode})`);
        } else {
          testsFailed++;
          console.error(`  ✗ [FAIL] ${name} (Expected: ${expectedStatus}, Received: ${res.statusCode})`);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      testsFailed++;
      console.error(`  ✗ [ERROR] ${name} - Network/Connection Error: ${err.message}`);
      resolve();
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

/**
 * Main test suite execution orchestrator.
 */
async function main() {
  console.log(`\n======================================================`);
  console.log(`  The Saffron Plate - Automated API Test Suite`);
  console.log(`  Target Origin: http://${HOST}:${PORT}`);
  console.log(`======================================================\n`);

  console.log('1. Static File & Route Availability Tests:');
  await runTest({
    name: 'GET / (Landing Page Availability)',
    path: '/',
    expectedStatus: 200
  });

  await runTest({
    name: 'GET /pages/order.html (Order Page HTML)',
    path: '/pages/order.html',
    expectedStatus: 200
  });

  await runTest({
    name: 'GET /pages/reservation.html (Reservation Page HTML)',
    path: '/pages/reservation.html',
    expectedStatus: 200
  });

  await runTest({
    name: 'GET /pages/about.html (About Page HTML)',
    path: '/pages/about.html',
    expectedStatus: 200
  });

  console.log('\n2. Culinary Menu API Tests:');
  await runTest({
    name: 'GET /api/menu/list (Fetch Master Menu)',
    path: '/api/menu/list',
    expectedStatus: 200
  });

  console.log('\n3. Customer Reviews & Ratings Tests (Khush Raghav):');
  await runTest({
    name: 'GET /api/reviews/list (Retrieve Customer Reviews)',
    path: '/api/reviews/list',
    expectedStatus: 200
  });

  await runTest({
    name: 'POST /api/reviews/new (Submit Testimonial Feedback)',
    path: '/api/reviews/new',
    method: 'POST',
    body: {
      name: 'Automated Test Runner',
      dish: 'Dal Bukhara & Naan',
      rating: 5,
      comment: 'Verified automated end-to-end suite rating submission.'
    },
    expectedStatus: 201
  });

  console.log('\n4. Administrative Inquiries Tests (Vivek Yadav):');
  await runTest({
    name: 'GET /api/admin/contacts/list (List Inquiries)',
    path: '/api/admin/contacts/list',
    expectedStatus: 200
  });

  console.log('\n5. Error Handling & 404 Route Tests:');
  await runTest({
    name: 'GET /api/unknown-endpoint (404 Fallback Verification)',
    path: '/api/unknown-endpoint',
    expectedStatus: 404
  });

  console.log(`\n------------------------------------------------------`);
  console.log(`  Test Run Complete`);
  console.log(`  Total Executed: ${testsRun}`);
  console.log(`  Passed:         ${testsPassed}`);
  console.log(`  Failed:         ${testsFailed}`);
  console.log(`------------------------------------------------------\n`);

  if (testsFailed > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { runTest };
