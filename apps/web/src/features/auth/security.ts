import bcrypt from 'bcryptjs';

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(14);
  return await bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (
  incomingPassword: string,
  userPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(incomingPassword, userPassword);

  return isMatch;
};
