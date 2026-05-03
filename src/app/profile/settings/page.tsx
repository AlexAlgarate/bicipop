import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { routes } from '@/config/routes';
import { getCurrentUser } from '@/features/auth/api';
import { SettingsHeader } from '@/features/profile/settings/_shared/components/SettingsHeader';
import { DeleteUserButton } from '@/features/profile/settings/delete/components/DeleteUser';
import { ProfileSection } from '@/features/profile/settings/update/components/ProfileSection';
import { PasswordSection } from '@/features/profile/settings/change-password/components/PasswordSection';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'User settings |  Bicipop',
};

export const UserSettingsPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect(routes.auth.login);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <SettingsHeader username={user.username} />

        <div className="space-y-6">
          <ProfileSection username={user.username} email={user.email} />
          <PasswordSection />
          <DeleteUserButton />
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
