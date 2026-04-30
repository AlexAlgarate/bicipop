export const routes = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
  },
  items: {
    upload: '/items/upload',
    edit: (id: string) => `/items/edit/${id}`,
    detail: (id: string) => `/items/${id}`,
    user: (username: string) => `/items/user/${username}`,
  },
  category: (categorySlug: string) => `/category/${categorySlug}`,
  dashboard: {
    dashboard: '/dashboard',
    settings: '/settings',
  },
  aboutUs: '/about',
  termsOfService: '/terms',
  search: '/search',
} as const;
