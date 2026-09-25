import api from '@/lib/axios';
import { setAuth, clearAuth } from '@/lib/auth';

/**
 * Authentication Service
 * Communicates with DummyJSON auth endpoints using the shared Axios instance.
 */
export const authService = {
  /**
   * Log in user with username and password
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} user data and token
   */
  async loginUser({ username, password }) {
    const response = await api.post('/auth/login', {
      username: username.trim(),
      password: password.trim(),
    });

    const data = response.data;
    // DummyJSON returns token (or accessToken in newer versions)
    const token = data.accessToken || data.token;

    if (!token) {
      throw new Error('Authentication succeeded but no token was returned.');
    }

    const user = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
      gender: data.gender,
    };

    // Store synchronously in localStorage for the Axios interceptor
    setAuth(token, user);

    return { user, token };
  },

  /**
   * Fetch current authenticated user profile
   * @returns {Promise<Object>} current user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user and clear stored credentials
   */
  logoutUser() {
    clearAuth();
  },
};

export default authService;
