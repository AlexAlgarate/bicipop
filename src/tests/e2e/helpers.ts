import { faker } from '@faker-js/faker';

export const VALID_PASSWORD = 'Password1,.-';

export const createTestUserCredentials = () => ({
  name: faker.internet.username(),
  email: faker.internet.email(),
  password: VALID_PASSWORD,
  confirmPassword: VALID_PASSWORD,
});

export const createTestUserCredentialsWithInvalidPasswordMatch = () => ({
  name: faker.internet.username(),
  email: faker.internet.email(),
  password: VALID_PASSWORD,
  confirmPassword: 'DifferentPassword123!',
});

export const createTestUserCredentialsWithInvalidPassword = () => ({
  name: faker.internet.username(),
  email: faker.internet.email(),
  password: '12',
  confirmPassword: '12',
});

export const TEST_IMAGE_URL =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400';

export const createTestProductData = () => ({
  title: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
  price: faker.number.int({ min: 100, max: 5000 }),
  location: faker.location.city(),
  imageUrl: TEST_IMAGE_URL,
});

export const GLOBAL_TEST_USER = {
  username: 'globaltestuser',
  email: 'global.testuser@example.com',
  password: VALID_PASSWORD,
};

export const OTHER_TEST_USER = {
  username: 'othertestuser',
  email: 'other.testuser@example.com',
  password: 'Password2,.-',
};

export const TEST_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400';

export const TEST_PRODUCTS = {
  CANYON_AEROROAD: {
    id: 'e2e-test-product-1',
    title: 'Canyon AeroRoad',
    description: 'Great road bike in excellen condition',
    price: 4500,
    location: 'Madrid, Spain',
  },
  MMR_RAKISH: {
    id: 'e2e-test-product-2',
    title: 'MMR Rakish',
    description: 'Great mtb bike in excellen condition',
    price: 1500,
    location: 'Huesca, Spain',
  },
  CANNONDALE_CAAD: {
    id: 'e2e-test-product-3',
    title: 'Cannondale Caad 14',
    description: 'Great road aluminium bike in excellen condition',
    price: 2000,
    location: 'Barcelona, Spain',
  } as const,
};
