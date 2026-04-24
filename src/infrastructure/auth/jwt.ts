import 'dotenv/config';

import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('AUTH_COOKIE_NAME must bedeclared in .env file');

const secret = new TextEncoder().encode(JWT_SECRET);

export type SessionTokenPayload = {
  userId: string;
};
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    return true;
  } catch {
    return false;
  }
};

export const signSessionToken = async (
  payload: SessionTokenPayload,
  expiresAt: Date
): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret);
};

export const verifySessionToken = async (
  token: string
): Promise<SessionTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    if (typeof payload.userId !== 'string') return null;

    return {
      userId: payload.userId,
    };
  } catch {
    return null;
  }
};
