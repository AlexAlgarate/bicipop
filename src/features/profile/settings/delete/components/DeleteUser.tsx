'use client';

import { useActionState, useState } from 'react';

import { FormField } from '@/components/ui/FormField';
import type { ProfileFormState } from '@/features/profile/settings/_shared/types';

import { deleteUserAction } from '../actions';

const initialState: ProfileFormState = {
  success: false,
  message: '',
  requestId: 0,
  values: { password: '' },
};

export const DeleteUserButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction] = useActionState(deleteUserAction, initialState);

  const passwordError = state?.errors?.password
    ? ([state.errors.password[0]] as [string])
    : undefined;

  if (showConfirm) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive rounded-lg">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Confirm account deletion
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          This action is permanent. All your data will be deleted and your account cannot
          be recovered.
        </p>

        <form action={formAction}>
          <FormField
            label="Password"
            htmlFor="password"
            error={passwordError}
          >
            <input
              name="password"
              type="password"
              className="input"
              required
            />
          </FormField>

          {state?.message && !state.success && (
            <p className="text-sm text-destructive mb-2">{state.message}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="btn bg-destructive hover:bg-destructive/90 text-white"
            >
              Yes, delete my account
            </button>

            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="btn bg-destructive hover:bg-destructive/90 text-white"
    >
      Delete my account
    </button>
  );
};