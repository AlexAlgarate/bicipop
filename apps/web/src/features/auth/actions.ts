'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthFormState } from '@/features/auth/types';
import { loginSchema, registerSchema } from '@/features/auth/validation';
import { getFieldErrorsFromTree } from '@/lib/validations/validation-errors';
import { authApi } from './api';

import { env } from '@/lib/environment-service';
const { AUTH_COOKIE_NAME } = env.get();

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

  try {
    await authApi.login(parsed.data.email.toLowerCase(), parsed.data.password);

    return {
      success: true,
      message: 'Sesión iniciada correctamente',
      errors: {},
      values: {},
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Credenciales inválidas',
      errors: {},
      values: { email: emailInput },
    };
  }
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const emailInput = String(formData.get('email'));
  const passwordInput = String(formData.get('password'));
  const usernameInput = String(formData.get('username'));

  const parsed = registerSchema.safeParse({
    email: emailInput,
    password: passwordInput,
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
      },
    };
  }

  try {
    await authApi.register(
      parsed.data.email.toLowerCase(),
      parsed.data.password,
      parsed.data.username,
    );

    return {
      success: true,
      message: 'Usuario creado correctamente',
      errors: {},
      values: {},
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error de conexión',
      errors: {},
      values: { email: emailInput, username: usernameInput },
    };
  }
}

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect('/');
};
