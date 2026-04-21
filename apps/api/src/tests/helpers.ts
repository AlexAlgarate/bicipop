import request, { Test } from 'supertest';
import { faker } from '@faker-js/faker';
import { getTestApp } from '@tests/setup';

export const VALID_PASSWORD = 'Qwertyui1.';

const API_PREFIX = '/api/v1';
export const API_REGISTER_URL = `${API_PREFIX}/auth/register`;
export const API_LOGIN_URL = `${API_PREFIX}/auth/login`;

export const signup = (email = faker.internet.email(), password = VALID_PASSWORD): Test =>
  request(getTestApp()).post(API_REGISTER_URL).send({ email, password });

export const login = (email: string, password = VALID_PASSWORD): Test =>
  request(getTestApp()).post(API_LOGIN_URL).send({ email, password });
