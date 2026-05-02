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
  const generalError = state?.errors?.general
    ? ([state.errors.general[0]] as [string])
    : undefined;

  if (showConfirm) {
    return (
      <div className="bg-destructive/5 border border-destructive rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-destructive mb-2">
          Delete account
        </h2>

        <p className="text-sm text-muted-foreground mb-6">
          This action is permanent. All your data will be deleted and your account cannot be
          recovered.
        </p>

        <form action={formAction} className="space-y-5">
          <FormField
            label="Password"
            htmlFor="password"
            error={passwordError}
          >
            <input
              name="password"
              type="password"
              id="password"
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
    <div className="bg-card rounded-xl shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Danger zone</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Permanently delete your account and all data
          </p>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="btn bg-destructive hover:bg-destructive/90 text-white"
        >
          Delete account
        </button>
      </div>
    </div>
  );
};