'use client';

import { useActionState, useState } from 'react';
import { Lock } from 'lucide-react';

import { FormField } from '@/components/ui/FormField';
import {
  getFieldError,
  type ProfileFormState,
} from '@/features/profile/settings/_shared/types';
import { changePasswordAction } from '@/features/profile/settings/change-password/actions';

const initialState: ProfileFormState = { success: false, message: '', requestId: 0 };

export const PasswordSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted" />
          <h2 className="font-semibold">Password</h2>
        </div>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            Change
          </button>
        )}
      </div>

      <div className="px-6 py-5">
        {isOpen ? (
          <PasswordForm onCancel={() => setIsOpen(false)} />
        ) : (
          <p className="text-sm text-muted">
            Update your password to keep your account secure.
          </p>
        )}
      </div>
    </div>
  );
};

const PasswordForm = ({ onCancel }: { onCancel: () => void }) => {
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <FormField
        label="Current password"
        htmlFor="currentPassword"
        error={getFieldError(state, 'currentPassword')}
      >
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          className="input"
        />
      </FormField>

      <FormField
        label="New password"
        htmlFor="newPassword"
        error={getFieldError(state, 'newPassword')}
      >
        <input id="newPassword" name="newPassword" type="password" className="input" />
      </FormField>

      <FormField
        label="Confirm password"
        htmlFor="confirmPassword"
        error={getFieldError(state, 'confirmPassword')}
      >
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="input"
        />
      </FormField>

      {state?.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={isPending} className="btn btn-primary text-sm">
          {isPending ? 'Updating...' : 'Update password'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
};
