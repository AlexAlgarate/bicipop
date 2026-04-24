import bcrypt from 'bcryptjs';

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const PROD_SALT = 14;
  const salt = await bcrypt.genSalt(PROD_SALT);
  return await bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (
  password: string,
  userPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, userPassword);
};
