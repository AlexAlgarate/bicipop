'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, User } from 'lucide-react';

import { FormField } from '@/components/ui/FormField';
import { updateUserProfileAction } from '@/features/profile/settings/update/actions';
import {
  getFieldError,
  type ProfileFormState,
} from '@/features/profile/settings/_shared/types';
import { routes } from '@/config/routes';

const initialState: ProfileFormState = {
  success: false,
  message: '',
  requestId: 0,
};

export const ProfileSection = ({
  email,
  username,
}: {
  username: string;
  email: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted" />
          <h2 className="font-semibold">Profile</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>

      <div className="px-6 py-5">
        {isEditing ? (
          <ProfileForm
            username={username}
            email={email}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{username}</p>
              <p className="text-sm text-muted">{email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileForm = ({
  username,
  email,
  onCancel,
}: {
  username: string;
  email: string;
  onCancel: () => void;
}) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateUserProfileAction,
    initialState
  );

  useEffect(() => {
    if (state?.success) {
      router.push(routes.profile.settings);
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} className="space-y-4">
      <FormField
        label="Username"
        htmlFor="username"
        error={getFieldError(state, 'username')}
      >
        <input
          id="username"
          name="username"
          type="text"
          className="input"
          defaultValue={state?.values?.username ?? username}
        />
      </FormField>

      <FormField label="Email" htmlFor="email" error={getFieldError(state, 'email')}>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          defaultValue={state?.values?.email ?? email}
        />
      </FormField>

      <FormField
        label="Current password"
        htmlFor="password"
        error={getFieldError(state, 'password')}
      >
        <input id="password" name="password" type="password" className="input" />
      </FormField>

      {state?.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={isPending} className="btn btn-primary text-sm">
          {isPending ? 'Saving...' : 'Save changes'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
};
