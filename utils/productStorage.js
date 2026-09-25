/**
 * Client-Side Mutation Overlay for DummyJSON
 *
 * DummyJSON mock server does NOT persist POST/PUT/DELETE operations permanently.
 * To provide a realistic, persistent CRUD experience in the dashboard, we store
 * created items, edited items, and deleted item IDs in localStorage.
 *
 * This utility applies this overlay seamlessly to API responses.
 */

const STORAGE_KEYS = {
  CUSTOM_PRODUCTS: 'nexus_custom_products',
  EDITED_PRODUCTS: 'nexus_edited_products',
  DELETED_IDS: 'nexus_deleted_product_ids',
};

// Helpers for safe localStorage access
const getStoredArray = (key) => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const getStoredMap = (key) => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const productStorage = {
  /**
   * Save a newly created product locally
   */
  addCustomProduct(product) {
    if (typeof window === 'undefined') return;
    const existing = getStoredArray(STORAGE_KEYS.CUSTOM_PRODUCTS);
    // Ensure unique ID that won't collide with DummyJSON (e.g. 10000 + Date.now())
    const newProduct = {
      ...product,
      id: product.id || Date.now(),
      createdAt: new Date().toISOString(),
      isCustom: true,
    };
    const updated = [newProduct, ...existing];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PRODUCTS, JSON.stringify(updated));
    return newProduct;
  },

  /**
   * Save an edit for any product (custom or API product)
   */
  updateProduct(id, updatedFields) {
    if (typeof window === 'undefined') return;
    const numericId = Number(id);

    // If it's a locally created custom product, update it in the custom array
    const custom = getStoredArray(STORAGE_KEYS.CUSTOM_PRODUCTS);
    const customIndex = custom.findIndex((p) => Number(p.id) === numericId);
    if (customIndex !== -1) {
      custom[customIndex] = { ...custom[customIndex], ...updatedFields };
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PRODUCTS, JSON.stringify(custom));
      return custom[customIndex];
    }

    // Otherwise, store field overrides in edited map
    const editedMap = getStoredMap(STORAGE_KEYS.EDITED_PRODUCTS);
    editedMap[numericId] = { ...(editedMap[numericId] || {}), ...updatedFields };
    localStorage.setItem(STORAGE_KEYS.EDITED_PRODUCTS, JSON.stringify(editedMap));
    return editedMap[numericId];
  },

  /**
   * Mark a product as deleted locally
   */
  deleteProduct(id) {
    if (typeof window === 'undefined') return;
    const numericId = Number(id);

    // Remove from custom products if it was custom
    const custom = getStoredArray(STORAGE_KEYS.CUSTOM_PRODUCTS);
    const filteredCustom = custom.filter((p) => Number(p.id) !== numericId);
    if (filteredCustom.length !== custom.length) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PRODUCTS, JSON.stringify(filteredCustom));
    }

    // Add to deleted IDs set
    const deletedIds = getStoredArray(STORAGE_KEYS.DELETED_IDS);
    if (!deletedIds.includes(numericId)) {
      deletedIds.push(numericId);
      localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(deletedIds));
    }
  },

  /**
   * Checks if an ID has been deleted locally
   */
  isDeleted(id) {
    const deletedIds = getStoredArray(STORAGE_KEYS.DELETED_IDS);
    return deletedIds.includes(Number(id));
  },

  /**
   * Get single product overlay (used when fetching single product detail)
   */
  applySingleProductOverlay(product) {
    if (!product) return null;
    const numericId = Number(product.id);

    if (this.isDeleted(numericId)) {
      return null;
    }

    const editedMap = getStoredMap(STORAGE_KEYS.EDITED_PRODUCTS);
    if (editedMap[numericId]) {
      return { ...product, ...editedMap[numericId] };
    }

    return product;
  },

  /**
   * Get custom created products list
   */
  getCustomProducts() {
    return getStoredArray(STORAGE_KEYS.CUSTOM_PRODUCTS);
  },

  /**
   * Apply local mutations to a fetched API product list
   */
  applyListOverlay(apiProducts = [], total = 0, { category = '', search = '', page = 1 } = {}) {
    const deletedIds = getStoredArray(STORAGE_KEYS.DELETED_IDS);
    const editedMap = getStoredMap(STORAGE_KEYS.EDITED_PRODUCTS);
    const customProducts = getStoredArray(STORAGE_KEYS.CUSTOM_PRODUCTS);

    // 1. Filter out deleted products from API response
    let modifiedProducts = apiProducts.filter((p) => !deletedIds.includes(Number(p.id)));

    // 2. Merge edited fields for API products
    modifiedProducts = modifiedProducts.map((p) => {
      const overrides = editedMap[Number(p.id)];
      return overrides ? { ...p, ...overrides } : p;
    });

    // 3. For page 1, prepend custom products matching search/category filters
    if (page === 1) {
      let filteredCustom = customProducts.filter((p) => !deletedIds.includes(Number(p.id)));

      if (category) {
        filteredCustom = filteredCustom.filter(
          (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const query = search.toLowerCase();
        filteredCustom = filteredCustom.filter(
          (p) =>
            (p.title && p.title.toLowerCase().includes(query)) ||
            (p.description && p.description.toLowerCase().includes(query)) ||
            (p.brand && p.brand.toLowerCase().includes(query))
        );
      }

      // Avoid duplicating if custom product already in list
      const existingIds = new Set(modifiedProducts.map((p) => Number(p.id)));
      const uniqueCustom = filteredCustom.filter((p) => !existingIds.has(Number(p.id)));

      modifiedProducts = [...uniqueCustom, ...modifiedProducts];
    }

    // Compute adjusted total count
    const deletedCount = deletedIds.length;
    const customCount = customProducts.length;
    const adjustedTotal = Math.max(0, total + customCount - deletedCount);

    return {
      products: modifiedProducts,
      total: adjustedTotal,
    };
  },
};

export default productStorage;
