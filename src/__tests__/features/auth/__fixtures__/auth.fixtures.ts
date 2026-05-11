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

export const buildRegisterFormData = (
  email = VALID_EMAIL,
  username = VALID_USERNAME,
  password = VALID_PASSWORD
): FormData => {
  const formData = new FormData();
  formData.set('email', email);
  formData.set('username', username);
  formData.set('password', password);
  return formData;
};

export const makeUser = () => ({
  id: '123',
  email: VALID_EMAIL,
  password: 'hashed-password',
});
