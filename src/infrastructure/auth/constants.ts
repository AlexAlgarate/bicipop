export const SESSION_COOKIE_NAME = 'session';
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export const JWT_ALGORITHM = 'HS256' as const;

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET must be declared in the environment');

export const JWT_SECRET_KEY = new TextEncoder().encode(jwtSecret);
