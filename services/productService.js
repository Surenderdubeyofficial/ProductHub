import api from '@/lib/axios';
import productStorage from '@/utils/productStorage';

/**
 * Product API Service
 * Centralizes all product data operations using the shared Axios instance.
 * Merges API responses with the client-side mutation overlay.
 */
export const productService = {
  /**
   * Fetch paginated products with optional sorting and artificial delay
   */
  async getProducts({
    limit = 10,
    skip = 0,
    sortBy = '',
    order = 'asc',
    delay,
    signal,
  } = {}) {
    const params = { limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || 'asc';
    }
    if (delay !== undefined) {
      params.delay = delay;
    }

    const response = await api.get('/products', { params, signal });
    const page = Math.floor(skip / limit) + 1;

    // Apply local additions, edits, and deletions
    const overlay = productStorage.applyListOverlay(
      response.data.products,
      response.data.total,
      { page }
    );

    return {
      products: overlay.products,
      total: overlay.total,
      skip: response.data.skip,
      limit: response.data.limit,
    };
  },

  /**
   * Search products by query keyword (debounced & cancellable)
   */
  async searchProducts({
    q = '',
    limit = 10,
    skip = 0,
    delay,
    signal,
  } = {}) {
    const params = { q: q.trim(), limit, skip };
    if (delay !== undefined) {
      params.delay = delay;
    }

    const response = await api.get('/products/search', { params, signal });
    const page = Math.floor(skip / limit) + 1;

    const overlay = productStorage.applyListOverlay(
      response.data.products,
      response.data.total,
      { search: q, page }
    );

    return {
      products: overlay.products,
      total: overlay.total,
      skip: response.data.skip,
      limit: response.data.limit,
    };
  },

  /**
   * Fetch all product categories normalized to { slug, name }
   */
  async getCategories() {
    const response = await api.get('/products/categories');
    const rawCategories = response.data;

    // Normalize response whether DummyJSON returns strings or objects
    return (rawCategories || []).map((cat) => {
      if (typeof cat === 'string') {
        const readableName = cat
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return { slug: cat, name: readableName };
      }
      return {
        slug: cat.slug || cat.name,
        name: cat.name || cat.slug,
      };
    });
  },

  /**
   * Fetch products filtered by category
   */
  async getProductsByCategory({
    category,
    limit = 10,
    skip = 0,
    sortBy = '',
    order = 'asc',
    delay,
    signal,
  }) {
    const params = { limit, skip };
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || 'asc';
    }
    if (delay !== undefined) {
      params.delay = delay;
    }

    const response = await api.get(`/products/category/${encodeURIComponent(category)}`, {
      params,
      signal,
    });
    const page = Math.floor(skip / limit) + 1;

    const overlay = productStorage.applyListOverlay(
      response.data.products,
      response.data.total,
      { category, page }
    );

    return {
      products: overlay.products,
      total: overlay.total,
      skip: response.data.skip,
      limit: response.data.limit,
    };
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id, { signal } = {}) {
    const numericId = Number(id);

    // If marked deleted locally, return 404
    if (productStorage.isDeleted(numericId)) {
      const err = new Error('Product not found');
      err.status = 404;
      err.friendlyMessage = `Product #${id} was deleted.`;
      throw err;
    }

    // Check if it's a locally created product
    const custom = productStorage.getCustomProducts();
    const customItem = custom.find((p) => Number(p.id) === numericId);
    if (customItem) {
      return customItem;
    }

    // Otherwise, fetch from DummyJSON via Axios
    const response = await api.get(`/products/${numericId}`, { signal });
    return productStorage.applySingleProductOverlay(response.data);
  },

  /**
   * Create a new product (POST /products/add)
   */
  async createProduct(productData) {
    let apiData = null;
    try {
      const response = await api.post('/products/add', productData);
      apiData = response.data;
    } catch (e) {
      // DummyJSON might throw if offline, but we still ensure graceful fallback
      console.warn('DummyJSON add endpoint warning:', e);
    }

    // Persist in local mutation overlay
    const newProduct = {
      ...(apiData || productData),
      id: (apiData && apiData.id) || Date.now(),
      title: productData.title,
      description: productData.description,
      price: Number(productData.price),
      stock: Number(productData.stock),
      category: productData.category,
      brand: productData.brand || 'Nexus Brand',
      rating: 5.0,
      thumbnail:
        productData.thumbnail ||
        'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
      images: [
        productData.thumbnail ||
          'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
      ],
    };

    return productStorage.addCustomProduct(newProduct);
  },

  /**
   * Update an existing product (PUT /products/:id)
   */
  async updateProduct(id, productData) {
    const numericId = Number(id);

    // Call DummyJSON endpoint if it's within default ID range (< 1000)
    if (numericId < 1000) {
      try {
        await api.put(`/products/${numericId}`, productData);
      } catch (e) {
        console.warn('DummyJSON update endpoint warning:', e);
      }
    }

    // Update in local mutation overlay
    return productStorage.updateProduct(numericId, productData);
  },

  /**
   * Delete product by ID (DELETE /products/:id)
   */
  async deleteProduct(id) {
    const numericId = Number(id);

    // Call DummyJSON endpoint if it's an API product
    if (numericId < 1000) {
      try {
        await api.delete(`/products/${numericId}`);
      } catch (e) {
        console.warn('DummyJSON delete endpoint warning:', e);
      }
    }

    // Mark deleted in local overlay
    productStorage.deleteProduct(numericId);
    return { success: true, id: numericId };
  },
};

export default productService;
