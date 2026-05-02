'use client';

import { useActionState, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

import { FormField } from '@/components/ui/FormField';
import {
  getFieldError,
  type ProfileFormState,
} from '@/features/profile/settings/_shared/types';

import { deleteUserAction } from '../actions';

const initialState: ProfileFormState = { success: false, message: '', requestId: 0 };

export const DeleteUserButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction, isPending] = useActionState(deleteUserAction, initialState);

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-colors ${
        showConfirm ? 'border-destructive/50 bg-destructive/5' : 'border-border bg-card'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-inherit">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={`h-4 w-4 ${showConfirm ? 'text-destructive' : 'text-muted'}`}
          />
          <h2 className={`font-semibold ${showConfirm ? 'text-destructive' : ''}`}>
            Danger zone
          </h2>
        </div>
        {!showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-destructive hover:text-destructive/80 transition-colors cursor-pointer"
          >
            Delete account
          </button>
        )}
      </div>

      <div className="px-6 py-5">
        {showConfirm ? (
          <>
            <p className="text-sm text-muted mb-4">
              This action is{' '}
              <span className="font-medium text-foreground">permanent</span>. All your
              data will be deleted and cannot be recovered. Enter your password to
              confirm.
            </p>

            <form action={formAction} className="space-y-4">
              <FormField
                label="Password"
                htmlFor="password"
                error={getFieldError(state, 'password')}
              >
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input border-destructive/50 focus:ring-destructive/30"
                />
              </FormField>

              {state?.message && !state.success && (
                <p className="text-sm text-destructive">{state.message}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn bg-destructive hover:bg-destructive/90 text-white text-sm"
                >
                  {isPending ? 'Deleting...' : 'Yes, delete my account'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="btn btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-sm text-muted">
            Permanently delete your account and all associated data.
          </p>
        )}
      </div>
    </div>
  );
};
