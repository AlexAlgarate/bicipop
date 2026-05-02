'use client';

import { useActionState, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

import { FormField } from '@/components/ui/FormField';
import type { UserDTO } from '@/domain/user/types';
import { updateUserProfileAction } from '@/features/profile/settings/update/actions';
import type { ProfileFormState } from '@/features/profile/settings/_shared/types';

export const ProfileSection = ({ user }: { user: UserDTO }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <h2 className="text-2xl mb-2">Profile</h2>
      {isEditing ? (
        <ProfileForm
          user={user}
          onCancel={() => setIsEditing(false)}
          action={updateUserProfileAction}
        />
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p>{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

const initialValues: ProfileFormState = {
  success: false,
  message: '',
  requestId: 0,
  values: { email: '', username: '' },
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

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField label="Username" htmlFor="username">
        <input name="username" defaultValue={user.username} className="input" />
      </FormField>

      <FormField label="Email" htmlFor="email">
        <input name="email" type="email" defaultValue={user.email} className="input" />
      </FormField>

      <div className="flex gap-2">
        <button className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
