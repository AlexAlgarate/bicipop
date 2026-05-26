export const routes = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
  },
  products: {
    upload: '/products/upload',
    edit: (id: string) => `/products/edit/${id}`,
    detail: (id: string) => `/products/${id}`,
    user: (username: string) => `/products/user/${username}`,
  },
  category: (categorySlug: string) => `/category/${categorySlug}`,
  profile: {
    dashboard: '/profile/dashboard',
    messages: '/profile/messages',
    settings: '/profile/settings',
    favorites: '/profile/favorites',
  },
  messages: {
    list: '/profile/messages',
    chat: (id: string) => `/messages/${id}`,
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
