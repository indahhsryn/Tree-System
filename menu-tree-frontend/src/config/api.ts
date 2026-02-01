const API_BASE_URL =
  process.env.REACT_APP_API_URL ?? 'http://localhost:30000';

export const API = {
  menus: `${API_BASE_URL}/api/menus`,
};
