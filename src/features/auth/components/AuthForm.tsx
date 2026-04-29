'use client';

import { type ReactNode, useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { type AuthFormState, initialRegisterState } from '@/features/auth/types';
import { isPasswordValid } from '@/features/auth/validation';

import { PasswordRules } from './PasswordRules';

type FieldConfig = {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  showPasswordRules?: boolean;
};

interface Props {
  action: (_prevState: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  fields: FieldConfig[];
  submitText: string;
  footer?: ReactNode;
  redirectTo?: string;
}

export const AuthForm = ({
  action,
  fields,
  submitText,
  footer,
  redirectTo = '/',
}: Props) => {
  const router = useRouter();
  const [state, formAction] = useActionState(action, initialRegisterState);
  const [passwordValue, setPasswordValue] = useState('');

  useEffect(() => {
    if (state.success) {
      router.push(redirectTo);
    }
  }, [router, state.success, redirectTo]);

  const passwordInvalidRules =
    passwordValue.length > 0 && !isPasswordValid(passwordValue);

  return (
    <form
      action={formAction}
      className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card shadow-sm p-8 space-y-5"
    >
      {fields.map(field => (
        <div key={field.name}>
          <FormField
            label={field.label}
            htmlFor={field.name}
            error={state.errors?.[field.name]}
          >
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              defaultValue={state.values?.[field.name]}
              placeholder={field.placeholder}
              onChange={e => {
                if (field.name === 'password') {
                  setPasswordValue(e.target.value);
                }
              }}
              className={
                field.showPasswordRules && passwordInvalidRules
                  ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
                  : ''
              }
            />
          </FormField>
          {field.showPasswordRules && <PasswordRules password={passwordValue} />}
        </div>
      ))}

      <Button
        type="submit"
        className="w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground py-2.5 mt-2"
      >
        {submitText}
      </Button>

      {footer && <div>{footer}</div>}

      {state.message && (
        <p
          className={`text-sm text-center ${
            state.success
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
};
