'use client';

import { type ReactNode, useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { FormField } from './FormField';
import { Button } from '@/components/ui/Button';
import { AuthFormState, initialRegisterState } from '../types';
import { PasswordRules } from './PasswordRules';
import { MIN_PASSWORD_LENGTH } from '@/utils/constants';

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
}

export const AuthForm = ({ action, fields, submitText, footer }: Props) => {
  const router = useRouter();
  const [state, formAction] = useActionState(action, initialRegisterState);
  const [passwordValue, setPasswordValue] = useState('');

  useEffect(() => {
    if (state.success) {
      router.push('/');
    }
  }, [router, state.success]);

  const passwordTouched = passwordValue.length > MIN_PASSWORD_LENGTH;
  const passwordInvalidRules =
    passwordTouched &&
    !(
      passwordValue.length >= MIN_PASSWORD_LENGTH &&
      /[A-Z]/.test(passwordValue) &&
      /[a-z]/.test(passwordValue) &&
      /[0-9]/.test(passwordValue)
    );

  return (
    <form
      action={formAction}
      className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card shadow-sm p-8 space-y-5"
    >
      {fields.map((field) => (
        <div key={field.name}>
          <FormField
            name={field.name}
            label={field.label}
            type={field.type}
            defaultValue={state.values?.[field.name]}
            error={state.errors?.[field.name]?.[0]}
            placeholder={field.placeholder}
            onChange={(e) => {
              if (field.name === 'password') {
                setPasswordValue(e.target.value);
              }
            }}
            clientError={field.showPasswordRules ? passwordInvalidRules : undefined}
          />
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
