export const routes = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
  },
  items: {
    upload: '/items/upload',
    edit: '/items/edit',
    detail: '/items',
  },
  category: '/category',
  dashboard: '/dashboard',
  user: '/user',
  aboutUs: '/about',
  termsOfService: '/terms',
  search: '/search',
} as const;
