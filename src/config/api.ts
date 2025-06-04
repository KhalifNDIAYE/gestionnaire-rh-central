
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://votre-api-deployee.com/api'
  : 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Users
  users: '/users',
  userProfile: (id: string) => `/users/${id}`,
  
  // Organizational Units
  organizationalUnits: '/organizational-units',
  organizationalUnit: (id: string) => `/organizational-units/${id}`,
  
  // Memorandums
  memorandums: '/memorandums',
  memorandum: (id: string) => `/memorandums/${id}`,
  
  // Projects
  projects: '/projects',
  project: (id: string) => `/projects/${id}`,
  
  // Auth
  login: '/auth/login',
  logout: '/auth/logout',
} as const;
