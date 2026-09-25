# NexusAdmin — Product Management Dashboard

A modern, production-grade Product Admin Dashboard built for a **Senior React Developer Hiring Assignment**.

Crafted exclusively with **Next.js (App Router)**, **JavaScript (ES6+)**, **Tailwind CSS**, and **Axios**, backed by the [DummyJSON API](https://dummyjson.com). All state management, URL synchronization, debouncing, race condition cancellation, pagination math, and simulated CRUD mutations are implemented **from scratch** with zero third-party UI table, pagination, or query libraries.

---

## Table of Contents
1. [Live Demo & Repository](#live-demo--repository)
2. [Project Overview](#project-overview)
3. [Key Features](#key-features)
4. [Tech Stack & Constraints Checklist](#tech-stack--constraints-checklist)
5. [Demo Authentication Credentials](#demo-authentication-credentials)
6. [Quick Start & Setup Instructions](#quick-start--setup-instructions)
7. [Environment Variables](#environment-variables)
8. [Project Architecture & Folder Structure](#project-architecture--folder-structure)
9. [Detailed Technical Decisions](#detailed-technical-decisions)
   - [A. Centralized Axios Instance & Interceptors](#a-centralized-axios-instance--interceptors)
   - [B. Authentication Flow & Protected Routes](#b-authentication-flow--protected-routes)
   - [C. Manual Pagination Engine](#c-manual-pagination-engine)
   - [D. URL State Synchronization & Safe Sanitization](#d-url-state-synchronization--safe-sanitization)
   - [E. Debounced Search & Race Condition Cancellation](#e-debounced-search--race-condition-cancellation)
   - [F. Search vs. Category Filter Trade-off](#f-search-vs-category-filter-trade-off)
   - [G. DummyJSON Mutation Strategy (CRUD Overlay)](#g-dummyjson-mutation-strategy-crud-overlay)
   - [H. Responsive Layout (Desktop Table vs. Mobile Cards)](#h-responsive-layout-desktop-table-vs-mobile-cards)
10. [Error Handling & Resiliency](#error-handling--resiliency)
11. [Verification & Test Checklist](#verification--test-checklist)
12. [Git Commit History](#git-commit-history)
13. [Vercel Deployment Guide](#vercel-deployment-guide)
14. [Engineering Challenges & Solutions](#engineering-challenges--solutions)
15. [AI Usage Declaration](#ai-usage-declaration)
16. [Technical Interview Guide & Cheat Sheet](#technical-interview-guide--cheat-sheet)

---

## 1. Project Overview

NexusAdmin is a production-quality enterprise dashboard designed for catalog administrators. It provides complete control over an e-commerce inventory: searching, category filtering, multi-column sorting, pagination, viewing comprehensive product specifications/reviews, creating new items, editing existing products, and safely deleting records with accessible confirmation modals.

The architecture emphasizes **simplicity, readability, and explainability**. A candidate can easily walk an interviewer through any file line-by-line without having to explain complex black-box abstractions.

---

## 2. Key Features

- **Strict Vanilla JavaScript**: Pure `.js` and `.jsx` with zero TypeScript overhead.
- **Enterprise SaaS Design**: Polished slate/indigo design system, accessible modals, responsive drawers, smooth focus rings, and badge indicators.
- **Centralized Axios Architecture**: Exactly one shared Axios instance with automated Bearer token attachment and centralized error/401 handling.
- **Bi-directional URL Synchronization**: All query parameters (`page`, `limit`, `search`, `category`, `sortBy`, `order`) are stored in the URL. Copying or bookmarking the URL restores the exact UI state.
- **Safe Parameter Sanitization**: Prevents crashes from corrupted or malicious query parameters (e.g. `?page=abc`, `?page=999`, `?limit=100`, `?order=invalid`).
- **Debounced Search with AbortController**: 450ms debounce with instant abort of in-flight HTTP requests. Stale requests can never overwrite newer search results (verified under 2000ms delay).
- **Client-Side CRUD Overlay**: Overcomes DummyJSON's ephemeral mock API limitation so user-created, edited, and deleted products persist reliably across sessions.
- **Double-Submission Prevention**: Protects login, create, edit, and delete actions against duplicate clicks while network calls are running.
- **Adaptive Layout**: Automatically transitions between a full-featured data table on desktop (>= 768px) and rich interactive cards on mobile (< 768px).
- **Graceful Loading, Empty, and Error States**: Skeleton loaders prevent layout shifts, empty search states provide 1-click filter resets, and network failures offer an active Retry button.

---

## 3. Tech Stack & Constraints Checklist

| Technology / Tool | Version | Purpose / Assignment Role |
| :--- | :--- | :--- |
| **Next.js** | 14.2.15 (App Router) | React Framework with client-side route navigation |
| **React** | 18.3.1 | Core UI Library (strict hook-based state management) |
| **JavaScript** | ES6+ | Strict requirement: **No TypeScript** |
| **Tailwind CSS** | 3.4.14 | Utility-first responsive styling and typography |
| **Axios** | 1.7.7 | Exclusive HTTP client via `lib/axios.js` (No `fetch` used) |
| **Lucide React** | 0.453.0 | Lightweight SVG icons |
| **DummyJSON API** | v1 / v2 | Mock e-commerce backend (`https://dummyjson.com`) |

### Strict Compliance Verification:
- [x] **No React Query / SWR / Redux**: All state is managed through React hooks (`useState`, `useEffect`, `useCallback`, `useRef`, custom `useDebounce`) and native browser APIs.
- [x] **No Ready-made Table or Pagination Libraries**: Data tables, mobile cards, pagination math, ellipsis calculation, and page boundaries are written manually.
- [x] **No Native Fetch**: 100% of API communication flows through the shared Axios client.
- [x] **No Placeholders or TODOs**: Every single route and user journey is fully implemented.

---

## 4. Demo Authentication Credentials

The application connects to DummyJSON's authentication service (`POST https://dummyjson.com/auth/login`).

| Attribute | Demo Value | Notes |
| :--- | :--- | :--- |
| **Username** | `emilys` | Case sensitive |
| **Password** | `emilyspass` | Case sensitive |
| **Quick Action** | **"Auto-fill"** Button | Present on `/login` for 1-click test fill |

---

## 5. Quick Start & Setup Instructions

### Prerequisites
- Node.js `v18.17+` or `v20.x` / `v22.x`
- npm `v9+` or `v10+`

### 1. Clone or Navigate to the Project
```bash
cd product-admin-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The root page will automatically route you to `/login` (or `/products` if already authenticated).

### 5. Run Verification & Test Suite
```bash
npm test
```
Executes the automated test suite verifying URL parameter sanitization, pagination clamping, authentication rejection/success, and AbortController 2000ms delay race condition cancellation.

### 6. Production Build & Linting
```bash
npm run lint
npm run build
npm start
```

---

## 6. Environment Variables

Create `.env.local` in the root directory:

```env
# Base URL for DummyJSON REST API
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

- `NEXT_PUBLIC_API_BASE_URL`: Injected into `lib/axios.js` to configure the Axios `baseURL`. Allows changing mock environments or pointing to a self-hosted mock server without modifying code.

---

## 7. Project Architecture & Folder Structure

```text
product-admin-dashboard/
├── .env.example                 # Example environment variables template
├── .env.local                   # Local environment configuration
├── package.json                 # Project dependencies and npm scripts
├── next.config.mjs              # Next.js configuration with remote image patterns
├── tailwind.config.js           # Tailwind theme and brand color configuration
├── postcss.config.mjs           # PostCSS configuration
├── .eslintrc.json               # Next.js ESLint rules
├── test/
│   └── verification.mjs         # Automated test suite (race condition, auth, pagination)
├── app/
│   ├── globals.css              # Global styles, Tailwind base, keyframe animations
│   ├── layout.jsx               # Root layout wrapping AuthProvider & ToastProvider
│   ├── page.jsx                 # Root redirector (/ -> /products or /login)
│   ├── not-found.jsx            # Global 404 error page
│   ├── login/
│   │   └── page.jsx             # Dedicated login page with validation & show/hide toggle
│   └── products/
│       ├── layout.jsx           # Protected dashboard layout with Sidebar & Navbar
│       ├── page.jsx             # Main product inventory table, search, filters & pagination
│       ├── new/
│       │   └── page.jsx         # Product creation page (POST /products/add)
│       └── [id]/
│           ├── page.jsx         # Detailed product view (specifications, reviews, gallery)
│           ├── not-found.jsx    # Product-specific 404 page
│           └── edit/
│               └── page.jsx     # Edit product page (PUT /products/:id)
├── components/
│   ├── common/
│   │   ├── Badge.jsx            # Multi-variant status badge component
│   │   ├── EmptyState.jsx       # Zero-state placeholder with "Clear Filters" action
│   │   ├── ErrorState.jsx       # Error banner with functional "Retry" button
│   │   ├── Loader.jsx           # Reusable SVG spinner component
│   │   ├── Skeleton.jsx         # Table and mobile card pulse loading skeletons
│   │   └── Toast.jsx            # Floating alert notifications container
│   ├── layout/
│   │   ├── Navbar.jsx           # Top header with profile, notifications & sign out
│   │   ├── ProtectedRoute.jsx   # Client-side authentication guard wrapper
│   │   └── Sidebar.jsx          # Desktop fixed navigation + mobile drawer
│   └── products/
│       ├── DeleteModal.jsx      # Confirmation modal with loading state for deletion
│       ├── Pagination.jsx       # Custom pagination component with page numbers & limit
│       ├── ProductCard.jsx      # Mobile card representation (< 768px)
│       ├── ProductFilters.jsx   # Search input, category dropdown, sort & direction toggle
│       ├── ProductForm.jsx      # Reusable validated form for Create and Edit
│       └── ProductTable.jsx     # Desktop data table (>= 768px)
├── context/
│   ├── AuthContext.jsx          # Authentication state provider (user, token, login, logout)
│   └── ToastContext.jsx         # Global toast dispatch provider
├── hooks/
│   ├── useAuth.js               # Convenience hook for consuming AuthContext
│   ├── useDebounce.js           # Debounce hook for user search input
│   └── useToast.js              # Convenience hook for dispatching toast alerts
├── lib/
│   ├── auth.js                  # Synchronous localStorage token helpers for interceptors
│   └── axios.js                 # Single shared Axios instance with interceptors
├── services/
│   ├── authService.js           # Authentication API service (POST /auth/login, /auth/me)
│   └── productService.js        # Catalog API service (GET/POST/PUT/DELETE /products)
└── utils/
    ├── formatters.js            # Currency, rating, and stock badge formatters
    ├── pagination.js            # Query sanitization, offset math, and ellipsis generator
    ├── productStorage.js        # Local mutation overlay engine for DummyJSON
    └── validation.js            # Pure validation functions for login and product forms
```

---

## 8. Detailed Technical Decisions

### A. Centralized Axios Instance & Interceptors (`lib/axios.js`)
Rather than calling raw Axios or importing different instances across pages, the entire application relies on a single shared instance configured in `lib/axios.js`.

- **Request Interceptor**: Synchronously retrieves the token via `getStoredToken()` in `lib/auth.js`. If present, it attaches `Authorization: Bearer <token>`.
- **Response Interceptor**:
  - Automatically checks for `401 Unauthorized` responses.
  - On 401, it purges credentials via `clearAuth()` and forces a clean redirect to `/login`.
  - Normalizes API error payloads into a readable `error.friendlyMessage`.
  - Seamlessly passes through cancelled errors (`axios.isCancel(error)`) without triggering false error notifications.

```javascript
// Request interceptor attaches token
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles 401 & error standardization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    error.friendlyMessage = error.response?.data?.message || 'An unexpected error occurred.';
    return Promise.reject(error);
  }
);
```

---

### B. Authentication Flow & Protected Routes
To keep the application interview-friendly and free from brittle cookie synchronizations:
1. `lib/auth.js` acts as the low-level synchronous storage layer (`auth_token` and `auth_user` in `localStorage`).
2. `context/AuthContext.jsx` exposes `user`, `token`, `isAuthenticated`, `login(user, pass)`, and `logout()`.
3. `components/layout/ProtectedRoute.jsx` wraps `app/products/layout.jsx`. When an unauthenticated visitor accesses any `/products/*` route, they are immediately redirected to `/login`.
4. When an authenticated user accesses `/login`, they are immediately bounced back to `/products`.
5. Multiple clicks on the login button are guarded by `isSubmitting` state.

---

### C. Manual Pagination Engine (`utils/pagination.js` & `components/products/Pagination.jsx`)
DummyJSON requires `limit` and `skip`. The pagination engine computes:
$$\text{skip} = (\text{currentPage} - 1) \times \text{limit}$$
$$\text{totalPages} = \max\left(1, \lceil \text{total} / \text{limit} \rceil\right)$$

- **Page sizes**: Supports `10`, `20`, and `50`. Changing the page size resets the current page to 1 to prevent out-of-range offsets.
- **Ellipsis Generation**: The custom `generatePageNumbers(currentPage, totalPages)` function produces an intelligent windowed sequence, e.g., `[1, 2, 3, 4, 5, '...', 20]` or `[1, '...', 7, 8, 9, '...', 20]`.
- **Status Text**: Renders formatted ranges such as `"Showing 21–40 of 194"`.

---

### D. URL State Synchronization & Safe Sanitization
Every search, filter, sort, page, and limit setting is stored as a query parameter in the URL:
```text
/products?page=2&limit=20&search=phone&sortBy=price&order=asc
```

#### Safe Sanitization Guard
To satisfy Section 11, `utils/pagination.js` sanitizes incoming parameters against malicious or invalid inputs:
- `page=abc` $\rightarrow$ clamped safely to `1`.
- `page=999` $\rightarrow$ dynamically bounded to `totalPages`.
- `limit=100` $\rightarrow$ restricted to `[10, 20, 50]`, falling back to `10`.
- `order=invalid` $\rightarrow$ falls back to `'asc'`.
- `sortBy=hacked` $\rightarrow$ falls back to `''`.

Updating filters triggers `router.push(newUrl, { scroll: false })`, ensuring page refreshes and link sharing preserve state without losing scroll context.

---

### E. Debounced Search & Race Condition Cancellation (`hooks/useDebounce.js`)
When searching, two critical challenges arise:
1. **Network Flooding**: Keystrokes must not fire on every character. The `useDebounce` hook introduces a 450ms idle delay.
2. **Race Conditions**: If a slow request for `"phone"` takes 2000ms, and a fast request for `"iphone"` finishes in 200ms, the old `"phone"` response must **never** overwrite the newer `"iphone"` results.

#### Solution: `AbortController` + Axios `signal`
```javascript
// In app/products/page.jsx:
const abortControllerRef = useRef(null);

const fetchProductList = async () => {
  // 1. Abort previous in-flight request if still running
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  // 2. Instantiate new controller
  const controller = new AbortController();
  abortControllerRef.current = controller;

  try {
    const result = await productService.searchProducts({
      q: urlSearch,
      limit: urlLimit,
      skip,
      delay: simulateDelay ? 2000 : undefined,
      signal: controller.signal, // Pass signal to Axios
    });
    setProducts(result.products);
  } catch (err) {
    // 3. Catch and ignore cancellation cleanly
    if (axios.isCancel(err) || err.name === 'CanceledError') {
      return; // Do not show error state to user
    }
    setError(err.friendlyMessage);
  }
};
```

#### Live Verification of Race Condition
NexusAdmin includes an interactive **"2s Delay"** toggle button right in the dashboard header (injecting `delay=2000` into DummyJSON). You can type rapidly and observe in the Network tab that prior requests are immediately marked as `(canceled)` and never overwrite the latest results.

---

### F. Search vs. Category Filter Trade-off
#### The DummyJSON Architectural Constraint:
DummyJSON provides two separate endpoints:
- `GET /products/search?q={query}`
- `GET /products/category/{category}`
It does **not** support combined querying (e.g. `GET /products/category/smartphones?q=apple`).

#### Our Product Decision:
- **Search takes priority**: Whenever the user types a search query, the search endpoint is queried, and the category filter is temporarily disabled and cleared.
- **Clear UI Communication**: An informational badge appears above the product table:
  > *"Search query is active. Category filter is disabled because DummyJSON does not support simultaneous search + category filtering."*
- When search is cleared, category filtering is immediately re-enabled.

---

### G. DummyJSON Mutation Strategy (CRUD Overlay)
#### The Mock API Limitation:
DummyJSON is a stateless mock REST API. When you call:
- `POST /products/add`: It returns a mock created object with a dummy ID (e.g. 195), but **does not** store it in the database.
- `PUT /products/:id`: It responds with modified JSON, but subsequent `GET` requests return original data.
- `DELETE /products/:id`: It responds with `isDeleted: true`, but the item remains in subsequent `GET` requests.

#### The Simple, Explainable Solution (`utils/productStorage.js`):
Rather than introducing heavy Redux stores, we maintain a lightweight client-side mutation overlay in `localStorage`:
1. `nexus_custom_products`: Array of newly added product objects.
2. `nexus_edited_products`: Dictionary of `{ [id]: { updatedFields } }`.
3. `nexus_deleted_product_ids`: Array of deleted product IDs.

When `productService` loads products from the API, it passes them through `productStorage.applyListOverlay()`:
- Filters out any products matching `nexus_deleted_product_ids`.
- Overwrites fields for any products in `nexus_edited_products`.
- Prepends custom items from `nexus_custom_products` to the first page.
- Accurately increments or decrements total item counts.

This gives the user a 100% persistent, realistic CRUD experience that survives page reloads while remaining trivial to explain in an interview.

---

### H. Responsive Layout (Desktop Table vs. Mobile Cards)
- **Desktop (>= 768px)**: Renders a structured `ProductTable` with thumbnail previews, titles, categories, pricing, discount percentages, rating badges, stock status badges, and action buttons.
- **Mobile (< 768px)**: Automatically replaces the table with responsive `ProductCard` components to eliminate horizontal table scrolling and ensure effortless touch targets.
- **Sidebar**: Fixed on desktop (`lg:pl-64`), collapsing into an animated touch-friendly backdrop drawer on tablets and smartphones.

---

## 9. Error Handling & Resiliency

1. **Centralized Standardization**: The Axios response interceptor extracts meaningful user messages, preventing raw stack traces or JSON syntax errors from leaking to the UI.
2. **Dedicated Error State Component**: Features an SVG icon, readable description, and an active **Retry** button that re-executes the exact failed operation.
3. **Empty State Component**: When search or filters yield 0 results, an empty state displays with a 1-click **"Clear Filters"** button.
4. **404 Routing**: Includes both a product-specific 404 page (`app/products/[id]/not-found.jsx`) and a global route 404 page (`app/not-found.jsx`).

---

## 10. Verification & Test Checklist

The project includes an automated test runner (`npm test`) in `test/verification.mjs`.

### Test Suite Results:
- [x] **URL Sanitization**: `page=abc` falls back to 1.
- [x] **Page Bounds**: `page=999` clamped to maximum available page.
- [x] **Limit Sanitization**: `limit=100` falls back to 10.
- [x] **Sort Sanitization**: Invalid sort fields and orders fall back to safe defaults.
- [x] **Authentication**: Valid login (`emilys` / `emilyspass`) returns token; invalid password correctly rejected.
- [x] **Race Condition with Delay 2000ms**: Request A is dispatched with 2000ms delay; Request B is dispatched; Request A is aborted via `AbortController`; cancellation error ignored; Request B finishes cleanly.

### Manual Verification Checklist:
- [x] **Login Page**:
  - `emilys` / `emilyspass` logs in successfully and redirects to `/products`.
  - Wrong password shows inline error alert.
  - Rapid double clicks disabled (`isSubmitting` prevents duplicate requests).
  - Visiting `/login` while logged in immediately redirects to `/products`.
  - Visiting `/products` while logged out immediately redirects to `/login`.
- [x] **Product Listing**:
  - Desktop displays complete responsive table.
  - Mobile displays touch-friendly cards.
  - Prominent "Add Product" button is visible and active.
- [x] **Pagination**:
  - Limit options (10, 20, 50) work as expected.
  - Showing text calculates correctly ("Showing 1–10 of 194").
  - Previous disabled on page 1; Next disabled on last page.
- [x] **URL State**:
  - Refreshing page preserves search, filters, sorting, and pagination.
  - Copying URL and opening in a new tab reproduces exact state.
- [x] **CRUD Operations**:
  - Add product: saves and appears at the top of the list.
  - View details: loads specifications, reviews, and gallery.
  - Edit product: updates values and reflects immediately.
  - Delete product: confirmation modal prompts user, removes item, and triggers toast.

---

## 11. Git Commit History

The repository was built through disciplined, atomic git commits reflecting engineering milestones:

1. `feat: initial next.js javascript project setup with tailwind css`
2. `feat: configure shared axios instance with interceptors`
3. `feat: implement authentication service and auth context`
4. `feat: build login page with client validation and route guard`
5. `feat: create responsive admin layout with navbar and sidebar`
6. `feat: implement product api service and local mutation store`
7. `feat: implement product listing with desktop table, mobile cards, pagination, and debounced search`
8. `feat: implement product details, creation, and editing workflows`

---

## 12. Vercel Deployment Guide

Deploying this Next.js project to Vercel takes under 2 minutes:

1. Push your repository to GitHub or GitLab.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://dummyjson.com`
5. Click **Deploy**. Next.js will build all static and dynamic routes automatically.

---

## 13. Engineering Challenges & Solutions

### Challenge 1: Ephemeral Mock API Mutations
**Problem**: In real interviews, candidates are often evaluated on whether their dashboard reflects created, updated, and deleted products. Because DummyJSON does not persist mutations, standard implementations lose all changes on the next list refresh.
**Solution**: Designed a client-side mutation overlay (`utils/productStorage.js`). It intercepts API list and detail responses and merges local mutations stored in `localStorage`. This creates a true persistent administrative experience without complicating the presentation components.

### Challenge 2: Search Race Conditions Under Heavy Network Latency
**Problem**: When users type rapidly, slower prior requests (e.g. searching for `"ca"`) may resolve after newer requests (e.g. searching for `"car"`), causing outdated results to overwrite modern data.
**Solution**: Paired a 450ms `useDebounce` hook with standard `AbortController` cancellation. Every new search request aborts any pending controller via `abortControllerRef.current.abort()`. In the Axios catch block, `axios.isCancel(err)` is identified and ignored, preventing erroneous error toasts while ensuring newer responses always win.

---

## 14. AI Usage Declaration

AI assistance was utilized during this project for:
- Initial project scaffolding and repetitive boilerplate generation.
- Drafting comprehensive test suites (`test/verification.mjs`) and edge case checklists.
- Refining documentation and interview question explanations.

All business logic (Axios interceptors, debouncing hooks, AbortController cancellation, URL synchronization, and the client mutation overlay) was architected and verified manually to guarantee production quality and line-by-line explainability.

---

## 15. Technical Interview Guide & Cheat Sheet

Study this section thoroughly before your technical interview. These are the exact questions interviewers frequently ask regarding this codebase:

### Q1: Why did you configure a single shared Axios instance instead of calling `fetch` or `axios.get` directly?
> **Answer**:
> *"A shared instance centralizes cross-cutting concerns: base URL configuration, request timeouts, and headers. More importantly, it allows us to attach interceptors:
> 1. The request interceptor injects the Bearer token dynamically before any request leaves the browser.
> 2. The response interceptor provides unified error formatting and globally intercepts `401 Unauthorized` responses to clear invalid sessions and redirect to `/login`.
> Keeping API calls inside dedicated service files (`productService.js`) completely decouples UI components from HTTP networking logic."*

### Q2: How does your search handle race conditions? Explain line-by-line.
> **Answer**:
> *"We handle race conditions using `AbortController` stored in a React `useRef`:
> 1. Before initiating a new fetch, we check `if (abortControllerRef.current) abortControllerRef.current.abort()`. This signals the browser to cancel the prior HTTP request.
> 2. We instantiate a fresh `new AbortController()` and pass `signal: controller.signal` into the Axios request config.
> 3. In the `catch` block, we verify `if (axios.isCancel(err) || err.name === 'CanceledError') return;`. This ensures that intentionally aborted requests do not display an error message to the user.
> Even if request A was artificially delayed by 2 seconds and request B returned in 100ms, request A will be aborted and will never overwrite request B."*

### Q3: Why is pagination state stored in the URL instead of local React state?
> **Answer**:
> *"Storing pagination, search queries, and sorting in URL search parameters (`?page=2&limit=20&search=phone`) makes application state shareable, bookmarkable, and persistent across page reloads. If a colleague shares a URL, the recipient sees the exact same filtered and paginated view. Furthermore, browser back/forward history works naturally without extra navigation code."*

### Q4: How do you guard against invalid URL parameters such as `?page=abc` or `?page=999`?
> **Answer**:
> *"We implemented a sanitization helper `sanitizeQueryParams()`. It parses integers safely using fallback checks:
> - If `page` is NaN or less than 1, it defaults to 1.
> - If `page` exceeds `totalPages`, our effect calculates the boundary and adjusts the URL to the last valid page.
> - If `limit` is not one of the allowed sizes (`10`, `20`, `50`), it falls back to 10.
> This guarantees that unexpected inputs never crash the application."*

### Q5: Why can't you combine search and category filtering simultaneously?
> **Answer**:
> *"DummyJSON exposes separate endpoints for search (`/products/search?q=`) and category filtering (`/products/category/{cat}`). It does not accept both parameters together. Rather than fetching the entire database to filter client-side (which is bad practice for large datasets), we made a deliberate product design decision: search takes precedence. When a search is active, category selection is disabled with an explanatory UI badge."*

### Q6: How did you implement CRUD persistence when DummyJSON is a mock API?
> **Answer**:
> *"DummyJSON's POST, PUT, and DELETE endpoints are simulated and do not permanently write to their backend. To ensure a real user experience, we created `utils/productStorage.js`. When a product is created or edited, it saves the changes to `localStorage`. When products are fetched from the API, our helper overlays these local mutations: filtering out deleted IDs, applying edited fields, and prepending custom products to the list. It's clean, lightweight, and doesn't require heavy external state libraries."*
