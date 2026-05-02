'use client';

import { useActionState, useState } from 'react';

import { FormField } from '@/components/ui/FormField';
import type { ProfileFormState } from '@/features/profile/settings/_shared/types';
import { changePasswordAction } from '@/features/profile/settings/change-password/actions';

const initialValues: ProfileFormState = {
  success: false,
  message: '',
  requestId: 0,
  values: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
};

export const PasswordSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Password</h2>
        {!isOpen && (
          <button
            className="btn btn-primary text-sm"
            onClick={() => setIsOpen(true)}
          >
            Change password
          </button>
        )}
      </div>

      {!isOpen && (
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure
        </p>
      )}

      {isOpen && <PasswordForm onCancel={() => setIsOpen(false)} />}
    </div>
  );
};

interface PasswordFormProps {
  onCancel: () => void;
}
const PasswordForm = ({ onCancel }: PasswordFormProps) => {
  const [state, formAction] = useActionState(changePasswordAction, initialValues);

  const currentPasswordError = state?.errors?.currentPassword
    ? ([state.errors.currentPassword[0]] as [string])
    : undefined;
  const newPasswordError = state?.errors?.newPassword
    ? ([state.errors.newPassword[0]] as [string])
    : undefined;
  const confirmPasswordError = state?.errors?.confirmPassword
    ? ([state.errors.confirmPassword[0]] as [string])
    : undefined;
  const generalError = state?.errors?.general
    ? ([state.errors.general[0]] as [string])
    : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <FormField
        label="Current password"
        htmlFor="currentPassword"
        error={currentPasswordError}
      >
        <input
          name="currentPassword"
          type="password"
          id="currentPassword"
          className="input"
          required
        />
      </FormField>

      <FormField
        label="New password"
        htmlFor="newPassword"
        error={newPasswordError}
      >
        <input
          name="newPassword"
          type="password"
          id="newPassword"
          className="input"
          required
        />
      </FormField>

      <FormField
        label="Confirm password"
        htmlFor="confirmPassword"
        error={confirmPasswordError}
      >
        <input
          name="confirmPassword"
          type="password"
          id="confirmPassword"
          className="input"
          required
        />
      </FormField>

      {(generalError || (state?.message && !state.success)) && (
        <p className="text-sm text-destructive">
          {generalError || state?.message}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary">
          Update password
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};