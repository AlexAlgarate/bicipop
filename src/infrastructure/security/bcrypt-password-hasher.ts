import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (
  password: string,
  userPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, userPassword);
};
