import { SignJWT, jwtVerify } from 'jose';

import { getJwtSecretKey, JWT_ALGORITHM } from '@/infrastructure/auth/constants';

export const signSessionToken = async (
  payload: { userId: string },
  expiresAt: Date
): Promise<string> => {
  const jwtSecret = getJwtSecretKey();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(jwtSecret);
};

export const verifySessionToken = async (
  token: string
): Promise<{ userId: string } | null> => {
  const jwtSecret = getJwtSecretKey();
  try {
    const { payload } = await jwtVerify(token, jwtSecret, {
      algorithms: [JWT_ALGORITHM],
    });
    if (typeof payload.userId !== 'string') return null;

    return { userId: payload.userId };
  } catch {
    return null;
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  const result = await verifySessionToken(token);
  return result !== null;
};
