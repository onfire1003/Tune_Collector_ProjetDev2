import { request } from './api.js';

export const login = (username, password) =>
  request('/api/auth/login', { method: 'POST', body: { username, password } });

export const logout = () => request('/api/auth/logout', { method: 'POST' });

export const fetchMe = () => request('/api/auth/me');
