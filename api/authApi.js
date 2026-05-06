import { BaseApi } from './baseApi.js';

export class AuthApi extends BaseApi {
  constructor(baseURL) {
    super(baseURL);
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;

    if (token) {
      this.defaultHeaders.Authorization = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders.Authorization;
    }
  }

  async login({ username, password }) {
    const response = await this.post('/api/auth/login', {
      username,
      password
    });

    const token = response?.token || response?.data?.token;

    if (token) {
      this.setAuthToken(token);
    }

    return response;
  }

  async register({ username, email, password }) {
    return this.post('/api/auth/register', {
      username,
      email,
      password
    });
  }
}