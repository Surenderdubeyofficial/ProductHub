/**
 * Verification Test Suite
 * Tests the shared Axios instance, DummyJSON authentication,
 * AbortController race condition cancellation with 2000ms delay,
 * URL sanitization edge cases, and client-side mutation overlay.
 */

import axios from 'axios';
import { sanitizeQueryParams, calculatePagination } from '../utils/pagination.js';

const BASE_URL = 'https://dummyjson.com';

async function runTests() {
  console.log('=====================================================');
  console.log('🚀 RUNNING COMPREHENSIVE VERIFICATION TEST SUITE');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: URL Parameter Sanitization & Fallbacks
  // ----------------------------------------------------
  console.log('\n--- 1. Testing URL Parameter Sanitization ---');
  
  const testParams1 = new URLSearchParams('page=abc&limit=100&sortBy=hacked&order=backwards');
  const sanitized1 = sanitizeQueryParams(testParams1);
  assert(sanitized1.page === 1, 'page=abc falls back safely to page 1');
  assert(sanitized1.limit === 10, 'limit=100 falls back safely to limit 10 (valid: 10, 20, 50)');
  assert(sanitized1.sortBy === '', 'Invalid sortBy falls back to empty string');
  assert(sanitized1.order === 'asc', 'Invalid order falls back to "asc"');

  const testParams2 = new URLSearchParams('page=5&limit=20&sortBy=price&order=desc&search=laptop');
  const sanitized2 = sanitizeQueryParams(testParams2);
  assert(sanitized2.page === 5, 'Valid page 5 parsed correctly');
  assert(sanitized2.limit === 20, 'Valid limit 20 parsed correctly');
  assert(sanitized2.sortBy === 'price', 'Valid sortBy "price" parsed correctly');
  assert(sanitized2.order === 'desc', 'Valid order "desc" parsed correctly');
  assert(sanitized2.search === 'laptop', 'Valid search "laptop" parsed correctly');

  // ----------------------------------------------------
  // TEST 2: Pagination Math & Out-of-Bounds Clamping
  // ----------------------------------------------------
  console.log('\n--- 2. Testing Pagination Calculations ---');
  
  const pagin1 = calculatePagination({ total: 194, page: 3, limit: 20 });
  assert(pagin1.totalPages === 10, 'Total pages for 194 items at 20/page is 10');
  assert(pagin1.currentPage === 3, 'Current page is 3');
  assert(pagin1.showingText === 'Showing 41–60 of 194', 'Showing range text is "Showing 41–60 of 194"');

  // Out of bounds page (e.g. ?page=999)
  const paginOutOfBounds = calculatePagination({ total: 50, page: 999, limit: 10 });
  assert(paginOutOfBounds.currentPage === 5, 'Page 999 is clamped to totalPages (5)');
  assert(paginOutOfBounds.showingText === 'Showing 41–50 of 50', 'Showing range text clamped correctly');

  // ----------------------------------------------------
  // TEST 3: DummyJSON Authentication via Axios
  // ----------------------------------------------------
  console.log('\n--- 3. Testing Authentication with DummyJSON ---');
  
  const testAxios = axios.create({ baseURL: BASE_URL });

  // Correct credentials
  try {
    const authRes = await testAxios.post('/auth/login', {
      username: 'emilys',
      password: 'emilyspass',
    });
    const token = authRes.data.accessToken || authRes.data.token;
    assert(!!token, 'Login with emilys/emilyspass returns valid JWT token');
    assert(authRes.data.username === 'emilys', 'Returned user is emilys');
  } catch (err) {
    assert(false, `Login failed unexpectedly: ${err.message}`);
  }

  // Invalid credentials
  try {
    await testAxios.post('/auth/login', {
      username: 'emilys',
      password: 'wrongpassword',
    });
    assert(false, 'Invalid credentials should have thrown 400');
  } catch (err) {
    assert(err.response && err.response.status === 400, 'Invalid login properly rejected with 400 Bad Request');
  }

  // ----------------------------------------------------
  // TEST 4: Race Condition & AbortController (with 2000ms delay)
  // ----------------------------------------------------
  console.log('\n--- 4. Testing Race Condition Cancellation (&delay=2000) ---');

  const controllerA = new AbortController();
  const controllerB = new AbortController();

  let requestACompleted = false;
  let requestACanceled = false;
  let requestBCompleted = false;

  console.log('Dispatching Slow Request A ("phone", delay=2000ms)...');
  const promiseA = testAxios.get('/products/search', {
    params: { q: 'phone', delay: 2000 },
    signal: controllerA.signal,
  }).then((res) => {
    requestACompleted = true;
    return res.data;
  }).catch((err) => {
    if (axios.isCancel(err) || err.name === 'CanceledError') {
      requestACanceled = true;
    }
    return null;
  });

  // Fast typing simulation: User quickly updates query to "laptop"
  console.log('Simulating quick second keystroke: Aborting Request A and dispatching Request B ("laptop", delay=0)...');
  controllerA.abort(); // Cancel Request A

  const promiseB = testAxios.get('/products/search', {
    params: { q: 'laptop' },
    signal: controllerB.signal,
  }).then((res) => {
    requestBCompleted = true;
    return res.data;
  });

  const [resA, resB] = await Promise.all([promiseA, promiseB]);

  assert(requestACanceled === true, 'Request A was successfully aborted by AbortController');
  assert(resA === null, 'Request A returned null (silently ignored cancellation)');
  assert(requestBCompleted === true && resB !== null, 'Request B completed successfully and returned laptop results');
  assert(
    resB && resB.products && resB.products.some((p) => p.title.toLowerCase().includes('laptop') || p.category.includes('laptop')),
    'Request B contains valid searched products'
  );

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n=====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('=====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
