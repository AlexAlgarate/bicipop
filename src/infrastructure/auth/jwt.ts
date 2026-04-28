import 'dotenv/config';

import { SignJWT, jwtVerify } from 'jose';

import type { SessionTokenPayload } from './types';
import { JWT_ALGORITHM, JWT_SECRET_KEY } from './constants';

export const signSessionToken = async (
  payload: SessionTokenPayload,
  expiresAt: Date
): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET_KEY);
};

export const verifySessionToken = async (
  token: string
): Promise<SessionTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY, {
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
