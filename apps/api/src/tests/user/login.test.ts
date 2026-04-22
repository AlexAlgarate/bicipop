import { createTestUser, loginTestUser, validCredentials } from '@tests/helpers';
import { SigninResponse, signinResponseSchema } from '@tests/schemas/test-user-schemas';
import status from 'http-status';

describe('POST /authentication/signin', () => {
  test('Should return 400 status code if email is missing', async () => {
    const { password } = validCredentials();

    const response = await loginTestUser({ password });

    expect(response.status).toBe(status.BAD_REQUEST);
  });
  test('Should return 400 status code if password is missing', async () => {
    const { email } = validCredentials();

    const response = await loginTestUser({ email });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Should return 400 for invalid email format', async () => {
    const { password } = validCredentials();

    const response = await loginTestUser({ email: 'not-an-email', password });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Should return 400 if the password is too short', async () => {
    const { email } = validCredentials();

    const response = await loginTestUser({ email, password: '123' });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Should return 404 if user not found', async () => {
    const { email, password } = validCredentials();

    const response = await loginTestUser({ email, password });

    expect(response.status).toBe(status.NOT_FOUND);
  });

  test('Should return 401 if credentials are invalid', async () => {
    const { username, email, password } = validCredentials();

    await createTestUser({ username, email, password });

    const response = await loginTestUser({ email, password: 'WrongPassword123' });

    expect(response.status).toBe(status.UNAUTHORIZED);
  });

  test('Should return token if credentials are valid', async () => {
    const { username, email, password } = validCredentials();

    await createTestUser({ username, email, password });

    const response = await loginTestUser({ email, password });

    expect(response.status).toBe(status.OK);

    const validateResponse: SigninResponse = signinResponseSchema.parse(response.body);
    expect(validateResponse.user).toBeDefined();
    expect(typeof validateResponse.user).toBe('object');
  });

  test('Should reject passwords without uppercase letters', async () => {
    const { email } = validCredentials();
    const invalidPassword = '123456789qwerqwer';

    const response = await loginTestUser({ email, password: invalidPassword });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Should reject passwords without lowercase letters', async () => {
    const { email } = validCredentials();
    const invalidPassword = '123456789QWERQWER';

    const response = await loginTestUser({ email, password: invalidPassword });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Should reject passwords without numbers', async () => {
    const { email } = validCredentials();
    const invalidPassword = 'QwerQwer';

    const response = await loginTestUser({ email, password: invalidPassword });

    expect(response.status).toBe(status.BAD_REQUEST);
  });

  test('Should reject passwords longer than 16 characters', async () => {
    const { email } = validCredentials();
    const invalidPassword = '123456789123456789';

    const response = await loginTestUser({ email, password: invalidPassword });

    expect(response.status).toBe(status.BAD_REQUEST);
  });
});
