'use client';

import { useActionState, useState } from 'react';

import { FormField } from '@/components/ui/FormField';
import { initialRegisterState, type AuthFormState } from '@/features/auth/types';
import { isPasswordValid } from '@/features/auth/validation';
import { PasswordRules } from '@/features/auth/components/PasswordRules';

import { useRedirect } from '../hooks/useRedirect';

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
  footer?: React.ReactNode;
}

export const AuthForm = ({ action, fields, submitText, footer }: Props) => {
  const [state, formAction, isPending] = useActionState(action, initialRegisterState);
  const [passwordValue, setPasswordValue] = useState('');

  const passwordInvalidRules =
    passwordValue.length > 0 && !isPasswordValid(passwordValue);

  useRedirect(state);

  return (
    <form
      noValidate
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
              defaultValue={state.values?.[field.name as keyof typeof state.values]}
              placeholder={field.placeholder}
              disabled={isPending}
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

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full text font-semibold mt-2 disabled:opacity-50"
      >
        {isPending ? 'Processing...' : submitText}
      </button>

      {footer && <div>{footer}</div>}

      {state?.message && !state.success && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {state.message}
        </div>
      )}

      {state?.message && state.success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          {state.message}
        </div>
      )}
    </form>
  );
};
