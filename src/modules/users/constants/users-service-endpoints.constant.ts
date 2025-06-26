export const USERS_SERVICE_ENDPOINTS = {
  createCustomer: () => '/users',
  getUserByEmail: (email: string) => `/users/email/${email}`,
  getUserById: (id: string) => `/users/${id}`,
  updatePassword: (id: string) => `/users/${id}/password`,
} as const;
