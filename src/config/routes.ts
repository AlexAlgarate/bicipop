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
  },
  category: (categorySlug: string) => `/category/${categorySlug}`,
  dashboard: {
    dashboard: '/dashboard',
    settings: '/settings',
  },
  user: (username: string) => `/user/${username}`,
  aboutUs: '/about',
  termsOfService: '/terms',
  search: '/search',
} as const;
