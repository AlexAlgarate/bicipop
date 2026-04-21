export const VALID_PASSWORD = 'Qwertyui1.';
import { faker } from '@faker-js/faker';

const API_PREFIX = '/api/v1';
export const API_REGISTER_URL = `${API_PREFIX}/auth/register`;
export const API_LOGIN_URL = `${API_PREFIX}/auth/login`;

export const validCredentials = () => {
  const username = faker.internet.username();

  return {
    username: username,
    email: `${username}@example.com`,
    password: VALID_PASSWORD,
  };
};
