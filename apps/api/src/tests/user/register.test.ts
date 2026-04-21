import { status } from 'http-status';
import request from 'supertest';

import { getTestApp, testPrisma } from '@tests/setup';
import { API_REGISTER_URL, VALID_PASSWORD } from '@tests/helpers';
import { faker } from '@faker-js/faker';
import { signupResponseSchema } from '@tests/schemas/test-user-schemas';

describe('POST /auth/register', () => {
  test('Email is mandatory', async () => {
    const response = await request(getTestApp())
      .post(API_REGISTER_URL)
      .send({ password: VALID_PASSWORD });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Password is mandatory', async () => {
    const response = await request(getTestApp())
      .post(API_REGISTER_URL)
      .send({ email: faker.internet.email() });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Username is mandatory', async () => {
    const email = faker.internet.email();

    const response = await request(getTestApp()).post(API_REGISTER_URL).send({
      email,
      password: VALID_PASSWORD,
    });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Should reject short passwords', async () => {
    const response = await request(getTestApp()).post(API_REGISTER_URL).send({
      email: faker.internet.email(),
      password: '123',
    });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Should rejet invalid email format', async () => {
    const response = await request(getTestApp()).post(API_REGISTER_URL).send({
      email: 'not-an-email',
      password: VALID_PASSWORD,
    });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Given valid credentials a new user is created', async () => {
    const username = faker.internet.username();
    const email = faker.internet.email();

    const response = await request(getTestApp())
      .post(API_REGISTER_URL)
      .send({ username, email, password: VALID_PASSWORD });

    expect(response.status).toBe(status.CREATED);
    expect(response.body).toEqual({ content: 'User created successfully' });

    const createdUser = await testPrisma.user.findUnique({
      where: {
        email,
      },
    });

    expect(createdUser).not.toBeNull();
    expect(createdUser?.username).toBe(username);
    expect(createdUser?.password).not.toBe(VALID_PASSWORD);
  });

  test('Email should be unique', async () => {
    const username = faker.internet.username();
    const email = faker.internet.email();

    const firstAttempResponse = await request(getTestApp()).post(API_REGISTER_URL).send({
      username,
      email,
      password: VALID_PASSWORD,
    });
    expect(firstAttempResponse.status).toBe(status.CREATED);

    const secondAttempResponse = await request(getTestApp()).post(API_REGISTER_URL).send({
      username: faker.internet.username(),
      email,
      password: VALID_PASSWORD,
    });
    expect(secondAttempResponse.status).toBe(status.CONFLICT);
  });

  test('Should not return password in response body', async () => {
    const response = await request(getTestApp()).post(API_REGISTER_URL).send({
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: VALID_PASSWORD,
    });

    const validateResponse = signupResponseSchema.parse(response.body);

    expect(validateResponse.content).not.toHaveProperty('password');
    expect(validateResponse.content).toBe('User created successfully');
  });

  test('Should reject passwords without uppercase letters', async () => {
    const email = faker.internet.email();
    const invalidPassword = '123456789qwerqwer';

    const response = await request(getTestApp()).post(API_REGISTER_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject passwords without lowercase letters', async () => {
    const email = faker.internet.email();
    const invalidPassword = '123456789QWERQWER';

    const response = await request(getTestApp()).post(API_REGISTER_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject passwords without numbers', async () => {
    const email = faker.internet.email();
    const invalidPassword = 'QwerQwer';

    const response = await request(getTestApp()).post(API_REGISTER_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });

  test('Should reject passwords longer than 16 characters', async () => {
    const email = faker.internet.email();
    const invalidPassword = '123456789123456789';

    const response = await request(getTestApp()).post(API_REGISTER_URL).send({
      email,
      password: invalidPassword,
    });

    expect(response.status).toBe(400);
  });
});
