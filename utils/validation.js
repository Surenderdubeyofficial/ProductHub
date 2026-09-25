/**
 * Form Validation Utilities
 * Pure JavaScript validation functions with field-level error messages.
 */

export function validateLoginForm({ username, password }) {
  const errors = {};

  if (!username || !username.trim()) {
    errors.username = 'Username is required';
  } else if (username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function validateSignupForm({ fullName, email, username, password }) {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!username || !username.trim()) {
    errors.username = 'Username is required';
  } else if (username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function validateProductForm(data) {
  const errors = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Product title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!data.description || !data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  if (data.price === '' || data.price === null || data.price === undefined) {
    errors.price = 'Price is required';
  } else {
    const numPrice = Number(data.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      errors.price = 'Price must be a positive number greater than 0';
    }
  }

  if (data.stock === '' || data.stock === null || data.stock === undefined) {
    errors.stock = 'Stock quantity is required';
  } else {
    const numStock = Number(data.stock);
    if (isNaN(numStock) || !Number.isInteger(numStock) || numStock < 0) {
      errors.stock = 'Stock must be a non-negative integer (0 or greater)';
    }
  }

  if (!data.category || !data.category.trim()) {
    errors.category = 'Please select a category';
  }

  if (data.discountPercentage !== undefined && data.discountPercentage !== '') {
    const disc = Number(data.discountPercentage);
    if (isNaN(disc) || disc < 0 || disc > 100) {
      errors.discountPercentage = 'Discount must be between 0% and 100%';
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
