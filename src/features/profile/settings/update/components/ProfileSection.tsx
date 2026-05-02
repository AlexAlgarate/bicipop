'use client';

import { useActionState, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

import { FormField } from '@/components/ui/FormField';
import type { UserDTO } from '@/domain/user/types';
import { updateUserProfileAction } from '@/features/profile/settings/update/actions';
import type { ProfileFormState } from '@/features/profile/settings/_shared/types';

const initialValues: ProfileFormState = {
  success: false,
  message: '',
  requestId: 0,
  values: { email: '', username: '', password: '' },
};

export const ProfileSection = ({ user }: { user: UserDTO }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        {!isEditing && (
          <button className="btn btn-primary text-sm" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <ProfileForm
          user={user}
          onCancel={() => setIsEditing(false)}
          action={updateUserProfileAction}
        />
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface ProfileFormProps {
  user: UserDTO;
  onCancel: () => void;
  action: (
    _prevState: ProfileFormState | null,
    formData: FormData
  ) => Promise<ProfileFormState | null>;
}
const ProfileForm = ({ user, onCancel, action }: ProfileFormProps) => {
  const [state, formAction] = useActionState(action, initialValues);

  useEffect(() => {
    if (state?.success) {
      redirect('/profile/settings');
    }
  }, [state]);

  const usernameError = state?.errors?.username
    ? ([state.errors.username[0]] as [string])
    : undefined;
  const emailError = state?.errors?.email
    ? ([state.errors.email[0]] as [string])
    : undefined;
  const passwordError = state?.errors?.password
    ? ([state.errors.password[0]] as [string])
    : undefined;
  const generalError = state?.errors?.general
    ? ([state.errors.general[0]] as [string])
    : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Username" htmlFor="username" error={usernameError}>
        <input
          name="username"
          defaultValue={user.username}
          id="username"
          className="input"
        />
      </FormField>

      <FormField label="Email" htmlFor="email" error={emailError}>
        <input
          name="email"
          type="email"
          defaultValue={user.email || ''}
          id="email"
          className="input"
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={passwordError}>
        <input name="password" type="password" id="password" className="input" required />
      </FormField>

      {generalError && <p className="text-sm text-destructive">{generalError}</p>}

      {state?.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
