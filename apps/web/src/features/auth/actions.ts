'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthFormState } from '@/features/auth/types';
import { comparePassword, hashPassword } from './security';
import { createSession, getSession } from '@/lib/auth';
import {
  getAuthUserByEmail,
  getUserByEmail,
  createUser,
  deleteUser,
  getUserById,
} from '@/features/auth/api';
import { getFieldErrorsFromTree } from '@/lib/validations/validation-errors';
import { loginSchema, registerSchema } from '@/features/auth/validation';
import { revalidatePath } from 'next/cache';

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
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
      message: 'Revisa los campos marcados',
      errors: getFieldErrorsFromTree(parsed.error),
      values: { email: emailInput },
    };
  }

  const email = parsed.data.email.toLowerCase();
  const user = await getAuthUserByEmail(email);

  if (!user) return invalidCredentials(emailInput);

  const validPassword = await comparePassword(parsed.data.password, user.passwordHash);

  if (!validPassword) return invalidCredentials(emailInput);

  await createSession(user.id);
  return {
    success: true,
    message: 'Sesión iniciada correctamente',
    errors: {},
    values: {},
  };
}

const invalidCredentials = (email: string): AuthFormState => ({
  success: false,
  message: 'Credenciales inválidas',
  errors: {},
  values: { email },
});

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const emailInput = String(formData.get('email'));
  const passwordInput = String(formData.get('password'));
  const locationInput = String(formData.get('location'));
  const usernameInput = String(formData.get('username'));

  const parsed = registerSchema.safeParse({
    email: emailInput,
    password: passwordInput,
    location: locationInput,
    username: usernameInput,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los campos marcados',
      errors: getFieldErrorsFromTree(parsed.error),
      values: {
        email: emailInput,
        username: usernameInput,
        location: locationInput,
      },
    };
  }

  const { email, password, username, location } = parsed.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      success: false,
      message: 'El usuario ya existe',
      errors: {},
      values: { username: usernameInput, location: locationInput },
    };
  }

  const passwordHash = await hashPassword(password);

  if (!passwordHash) {
    return {
      success: false,
      message: 'Credenciales incorrectas',
      errors: {},
      values: {
        email: emailInput,
        username: usernameInput,
        location: locationInput,
      },
    };
  }

  await createUser(email, username, passwordHash, location);

  return {
    success: true,
    message: 'Usuario creado correctamente',
    errors: {},
    values: {},
  };
}

export const logout = async () => {
  const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'session-token';

  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);
  revalidatePath('/');
  redirect('/');
};

export const deleteUserAccount = async () => {
  const session = await getSession();

  if (!session) {
    throw new Error('No hay sesión activa');
  }

  const user = await getUserById(session.userId);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  await deleteUser(user.email);

  const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'session-token';
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);

  revalidatePath('/');
  redirect('/');
};
