export type ProductSeed = {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
};

export const categories = [
  'Carretera',
  'Montaña (MTB)',
  'Gravel / CX',
  'Endurance',
  'Aero',
  'Descenso (DH)',
  'Triatlón / TT',
  'Pista / Fixie',
  'BMX / Dirt',
  'Urbana / Paseo',
  'Infantil',
  'Eléctrica',
  'Otros',
];

export const users = [
  {
    username: 'Example',
    email: 'example@example.com',
    avatar: 1,
  },
  {
    username: 'Pepe',
    email: 'example1@example.com',
    avatar: 2,
  },
  {
    username: 'Paco',
    email: 'example2@example.com',
    avatar: 3,
  },
  {
    username: 'Antonia',
    email: 'example3@example.com',
    avatar: 4,
  },
  {
    username: 'Pilar',
    email: 'example4@example.com',
    avatar: 5,
  },
  {
    username: 'Txus',
    email: 'example5@example.com',
    avatar: 6,
  },
];

export const bikeImages = [
  'https://images.unsplash.com/photo-1511994298241-608e28f14fde',
  'https://images.unsplash.com/photo-1728454994668-62f1c3b56e78',
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e',
  'https://images.unsplash.com/photo-1727433836544-cf57feeb0f21',
  'https://images.unsplash.com/photo-1630736701814-4778b0ab30e6',
];

export const productsData: ProductSeed[] = [
  // Carretera
  {
    title: 'Specialized Allez Elite',
    description: 'Bici de carretera de aluminio muy ligera, grupo Shimano 105.',
    price: 1100,
    category: 'Carretera',
    location: 'Huelva',
  },
  {
    title: 'Giant TCR Advanced 2',
    description: 'Cuadro carbono, ideal para entrenamientos y marchas.',
    price: 1900,
    category: 'Carretera',
    location: 'Huelva',
  },

  // Montaña
  {
    title: 'Orbea Alma H30',
    description: 'MTB rígida 29", Shimano Deore, muy cuidada.',
    price: 1200,
    category: 'Montaña (MTB)',
    location: 'Huelva',
  },
  {
    title: 'Trek X-Caliber 9',
    description: 'Mountain bike XC con horquilla RockShox.',
    price: 950,
    category: 'Montaña (MTB)',
    location: 'Sevilla',
  },

  // Gravel / CX
  {
    title: 'Specialized Diverge Comp',
    description: 'Gravel muy versátil para aventura y bikepacking.',
    price: 2100,
    category: 'Gravel / CX',
    location: 'Sevilla',
  },
  {
    title: 'Cannondale Topstone 3',
    description: 'Bici gravel aluminio con grupo Shimano GRX.',
    price: 1400,
    category: 'Gravel / CX',
    location: 'Sevilla',
  },

  // Endurance
  {
    title: 'Trek Domane SL5',
    description: 'Bici endurance muy cómoda para largas distancias.',
    price: 2600,
    category: 'Endurance',
    location: 'Guadalajara',
  },
  {
    title: 'Specialized Roubaix Sport',
    description: 'Carretera gran fondo con Future Shock.',
    price: 2400,
    category: 'Endurance',
    location: 'Cuenca',
  },

  // Aero
  {
    title: 'Canyon Aeroad CF SLX',
    description: 'Bici aero de carbono con Ultegra Di2.',
    price: 4200,
    category: 'Aero',
    location: 'Guadalajara',
  },
  {
    title: 'Scott Foil RC',
    description: 'Bici aero competición muy rápida.',
    price: 3900,
    category: 'Aero',
    location: 'Zamora',
  },

  // Descenso
  {
    title: 'Santa Cruz V10',
    description: 'Bici de descenso profesional usada en bike parks.',
    price: 4300,
    category: 'Descenso (DH)',
    location: 'Albacete',
  },
  {
    title: 'Commencal Supreme DH',
    description: 'Downhill muy robusta, perfecta para saltos.',
    price: 3500,
    category: 'Descenso (DH)',
    location: 'Zaragoga',
  },

  // Triatlón / TT
  {
    title: 'Cervélo P-Series',
    description: 'Bici de contrarreloj ideal para triatlón.',
    price: 3200,
    category: 'Triatlón / TT',
    location: 'León',
  },
  {
    title: 'Cube Aerium C68',
    description: 'Bici cabra con posición muy aerodinámica.',
    price: 2800,
    category: 'Triatlón / TT',
    location: 'Pamplona',
  },

  // Pista / Fixie
  {
    title: 'Cinelli Vigorelli',
    description: 'Fixie de acero muy popular en ciudad.',
    price: 850,
    category: 'Pista / Fixie',
    location: 'León',
  },
  {
    title: 'State Bicycle Co. 6061',
    description: 'Single speed ligera para uso urbano.',
    price: 600,
    category: 'Pista / Fixie',
    location: 'Girona',
  },

  // BMX
  {
    title: 'Cult Gateway BMX',
    description: 'BMX freestyle ideal para street.',
    price: 450,
    category: 'BMX / Dirt',
    location: 'Girona',
  },
  {
    title: 'Sunday Primer BMX',
    description: 'BMX para park y dirt jump.',
    price: 420,
    category: 'BMX / Dirt',
    location: 'Zarautz',
  },

  // Urbana
  {
    title: 'Brompton M6L',
    description: 'Bici urbana plegable muy práctica.',
    price: 1100,
    category: 'Urbana / Paseo',
    location: 'Lleida',
  },
  {
    title: 'Decathlon Elops 520',
    description: 'Bicicleta de paseo con cesta y portabultos.',
    price: 320,
    category: 'Urbana / Paseo',
    location: 'Zarautz',
  },

  // Infantil
  {
    title: 'Woom 3',
    description: 'Bici infantil ultraligera para niños de 4-6 años.',
    price: 350,
    category: 'Infantil',
    location: 'Zarautz',
  },
  {
    title: 'Orbea Grow 2',
    description: 'Bici infantil ajustable según crece el niño.',
    price: 280,
    category: 'Infantil',
    location: 'Getaria',
  },

  // Eléctrica
  {
    title: 'Specialized Turbo Levo',
    description: 'E-MTB con batería de larga duración.',
    price: 5200,
    category: 'Eléctrica',
    location: 'Getaria',
  },
  {
    title: 'Cube Kathmandu Hybrid',
    description: 'E-bike trekking perfecta para ciudad y rutas.',
    price: 3100,
    category: 'Eléctrica',
    location: 'Getaria',
  },

  // Otros
  {
    title: 'Bicicleta Tándem Trek',
    description: 'Bicicleta doble para dos personas.',
    price: 1500,
    category: 'Otros',
    location: 'Getaria',
  },
  {
    title: 'Triciclo adulto con cesta',
    description: 'Triciclo estable ideal para ciudad.',
    price: 650,
    category: 'Otros',
    location: 'Getaria',
  },
];
