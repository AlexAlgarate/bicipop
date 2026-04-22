import { env } from '@/lib/environment-service';

const getApiUrl = () => env.get().NEXT_PUBLIC_API_URL;

export interface LoginResponse {
  user: Record<string, unknown>;
}
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${getApiUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      } catch {
        throw new Error('Invalid credentials');
      }
    }

    return response.json();
  },

  register: async (
    email: string,
    password: string,
    username: string,
  ): Promise<void> => {
    const response = await fetch(`${getApiUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.message || 'Error while registering');
      } catch {
        throw new Error('Error while registering');
      }
    }

    try {
      await response.json();
    } catch {
      // Response is not JSON, but that's ok for register
    }
  },
};
