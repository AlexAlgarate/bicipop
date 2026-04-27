'use server';

import 'dotenv/config';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import type { AuthFormState } from '@/features/auth/types';
import { loginSchema, registerSchema } from '@/features/auth/validation';
import { getFieldErrorsFromTree } from '@/infrastructure/validations/validation-errors';
import { createSession, deleteSession } from '@/infrastructure/auth/session';
import {
  comparePassword,
  hashPassword,
} from '@/infrastructure/security/bcrypt-password-hasher';

import {
  getAuthUserByEmail,
  getUserByEmail,
  getUserByUsername,
  registerUser,
} from './api';

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
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

  const user = await getAuthUserByEmail(parsed.data.email);
  if (!user) return invalidCredentials(emailInput);

  const validPassword = await comparePassword(parsed.data.password, user.password);
  if (!validPassword) return invalidCredentials(emailInput);

  try {
    await createSession(user.id);
    revalidatePath('/');

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
}

const invalidCredentials = (email: string): AuthFormState => ({
  success: false,
  message: 'Invalid credentials',
  errors: {},
  values: { email },
});

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
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

  const { email, password, username } = parsed.data;

  if (confirmPasswordInput !== password) {
    return {
      success: false,
      message: 'Las contraseñas no coinciden',
      errors: {},
      values: {
        email: emailInput,
        username: usernameInput,
      },
    };
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      success: false,
      message: 'User already exists',
      errors: {},
      values: { username: usernameInput },
    };
  }

  const existingUsername = await getUserByUsername(username);

  if (existingUsername) {
    return {
      success: false,
      message: 'Username already taken',
      errors: {},
      values: { email: emailInput, username: usernameInput },
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
}

export const logout = async (): Promise<void> => {
  await deleteSession();
  revalidatePath('/');
  redirect('/');
};
