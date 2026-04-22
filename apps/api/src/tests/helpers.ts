import request, { Response } from 'supertest';
import { getTestApp } from '@tests/setup';

export const VALID_PASSWORD = 'Qwertyui1.';
import { faker } from '@faker-js/faker';

const API_PREFIX = '/api/v1';
export const API_REGISTER_URL = `${API_PREFIX}/auth/register`;
export const API_LOGIN_URL = `${API_PREFIX}/auth/login`;

type TestUserCredentials = {
  username: string;
  email: string;
  password: string;
};

export const validCredentials = (): TestUserCredentials => {
  const username = faker.internet.username();

  return {
    username: username,
    email: `${username}@example.com`,
    password: VALID_PASSWORD,
  };
};

export const createTestUser = async (credentials: {
  username: string;
  email: string;
  password: string;
}): Promise<void> => {
  await request(getTestApp()).post(API_REGISTER_URL).send(credentials);
};

export const loginTestUser = async (credentials: {
  email?: string;
  password?: string;
}): Promise<Response> => {
  return await request(getTestApp()).post(API_LOGIN_URL).send(credentials);
};
