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
  profile: {
    dashboard: '/profile/dashboard',
    settings: '/profile/settings',
    favorites: '/profile/favorites',
  },

  aboutUs: '/about',
  termsOfService: '/terms',
  search: '/search',
} as const;

export const footerCategories = [
  { name: 'Carretera', slug: 'carretera' },
  { name: 'Montaña (MTB)', slug: 'montana-mtb' },
  { name: 'Aero', slug: 'aero' },
  { name: 'Eléctrica', slug: 'electrica' },
] as const;
