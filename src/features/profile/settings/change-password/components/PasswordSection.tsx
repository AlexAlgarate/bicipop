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
    <div>
      <h2 className="text-2xl mb-2">Password</h2>

      {isOpen ? (
        <PasswordForm onCancel={() => setIsOpen(false)} />
      ) : (
        <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
          Change password
        </button>
      )}
    </div>
  );
};

const PasswordForm = ({ onCancel }: { onCancel: () => void }) => {
  const [state, formAction] = useActionState(changePasswordAction, initialValues);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField label="Current password" htmlFor="currentPassword">
        <input name="currentPassword" type="password" className="input" />
      </FormField>

      <FormField label="New password" htmlFor="newPassword">
        <input name="newPassword" type="password" className="input" />
      </FormField>

      <FormField label="Confirm password" htmlFor="confirmPassword">
        <input name="confirmPassword" type="password" className="input" />
      </FormField>

      {state?.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex gap-2">
        <button className="btn btn-primary">Update password</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
