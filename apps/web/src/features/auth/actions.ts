'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthFormState } from '@/features/auth/types';
import { loginSchema, registerSchema } from '@/features/auth/validation';
import { getFieldErrorsFromTree } from '@/lib/validations/validation-errors';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: parsed.data.password }),
    });

    if (!response.ok) {
      return invalidCredentials(emailInput);
    }

    const data = await response.json();
    const token = data.content;

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return {
      success: true,
      message: 'Sesión iniciada correctamente',
      errors: {},
      values: {},
    };
  } catch {
    return invalidCredentials(emailInput);
  }
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

  const { email, password, username } = parsed.data;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Error al registrar',
        errors: {},
        values: { username: usernameInput },
      };
    }

    return {
      success: true,
      message: 'Usuario creado correctamente',
      errors: {},
      values: {},
    };
  } catch {
    return {
      success: false,
      message: 'Error de conexión',
      errors: {},
      values: { username: usernameInput },
    };
  }
}

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  redirect('/');
};