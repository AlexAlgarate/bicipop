export const VALID_PASSWORD = 'ValidPassword1.';
export const VALID_EMAIL = 'test@test.com';
export const VALID_USERNAME = 'testUsername';

export const buildLoginFormData = (
  email = VALID_EMAIL,
  password = VALID_PASSWORD
): FormData => {
  const formData = new FormData();
  formData.set('email', email);
  formData.set('password', password);
  return formData;
};

export const buildRegisterFormData = (overrides?: {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}): FormData => {
  const password = overrides?.password ?? VALID_PASSWORD;

  const formData = new FormData();
  formData.set('email', overrides?.email ?? VALID_EMAIL);
  formData.set('username', overrides?.username ?? VALID_USERNAME);
  formData.set('password', password);
  formData.set('confirmPassword', overrides?.confirmPassword ?? password);

  return formData;
};

export const makeUser = (
  overrides?: Partial<{ id: string; email: string; password: string }>
) => ({
  id: '123',
  email: VALID_EMAIL,
  password: 'hashed-password',
  ...overrides,
});
