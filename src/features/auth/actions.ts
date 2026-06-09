'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import type { AuthFormState } from '@/features/auth/types';
import { loginSchema, registerSchema } from '@/features/auth/validation';
import { getFieldErrorsFromTree } from '@/utils/validation-errors';
import { createSession, deleteSession } from '@/infrastructure/auth/session';
import {
  comparePassword,
  hashPassword,
} from '@/infrastructure/security/bcrypt-password-hasher';
import { routes } from '@/config/routes';
import { rateLimit } from '@/infrastructure/security/rate-limit';

import { getUserForAuth, registerUser, checkIfUserExists } from './api';

export const loginAction = async (
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> => {
  if (!(await rateLimit('login'))) {
    return {
      success: false,
      message: 'Too many login attempts. Please try again later.',
      errors: {},
      values: {},
    };
  }

  const emailInput = String(formData.get('email'));
  const passwordInput = String(formData.get('password'));

  const parsed = loginSchema.safeParse({
    email: emailInput,
    password: passwordInput,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Check wrong fields',
      errors: getFieldErrorsFromTree(parsed.error),
      values: { email: emailInput },
    };
  }

  const user = await getUserForAuth(parsed.data.email);
  if (!user) return invalidCredentials(emailInput);

  const validPassword = await comparePassword(parsed.data.password, user.password);
  if (!validPassword) return invalidCredentials(emailInput);

  try {
    await createSession(user.id);
    revalidatePath(routes.home);

    return {
      success: true,
      message: 'Successful login',
      errors: {},
      values: {},
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Invalid credentials',
      errors: {},
      values: { email: emailInput },
    };
  }
};

const invalidCredentials = (email: string): AuthFormState => ({
  success: false,
  message: 'Invalid credentials',
  errors: {},
  values: { email },
});

export const registerAction = async (
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> => {
  const emailInput = String(formData.get('email'));
  const passwordInput = String(formData.get('password'));
  const confirmPasswordInput = String(formData.get('confirmPassword'));
  const usernameInput = String(formData.get('username'));

  const parsed = registerSchema.safeParse({
    email: emailInput,
    password: passwordInput,
    username: usernameInput,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Check wrong fields',
      errors: getFieldErrorsFromTree(parsed.error),
      values: {
        email: emailInput,
        username: usernameInput,
      },
    };
  }

  if (!(await rateLimit('register', 5))) {
    return {
      success: false,
      message: 'Too many registration attempts. Please try again later.',
      errors: {},
      values: {},
    };
  }

  const { email, password, username } = parsed.data;

  if (confirmPasswordInput !== password) {
    return {
      success: false,
      message: 'Passwords do not match',
      errors: {},
      values: {
        email: emailInput,
        username: usernameInput,
      },
    };
  }

  const { existingEmail, existingUsername } = await checkIfUserExists(email, username);

  if (existingEmail || existingUsername) {
    return {
      success: false,
      message: 'Credentials invalid',
      errors: {},
      values: {},
    };
  }

  const passwordHashed = await hashPassword(password);
  try {
    await registerUser(username, email, passwordHashed);

    return {
      success: true,
      message: 'User created successfully',
      errors: {},
      values: {},
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection error',
      errors: {},
      values: { email: emailInput, username: usernameInput },
    };
  }
};

export const logout = async (): Promise<void> => {
  await deleteSession();
  revalidatePath(routes.home);
  redirect(routes.home);
};
