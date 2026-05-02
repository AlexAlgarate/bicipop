import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { routes } from '@/config/routes';
import { getCurrentUser } from '@/features/auth/api';
import { SettingsHeader } from '@/features/profile/settings/components/SettingsHeader';
import { DeleteUserButton } from '@/features/profile/settings/components/DeleteUser';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'User settings |  Bicipop',
};

export const UserSettingsPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect(routes.auth.login);

  return (
    <div className="container mx-auto px-4 py-8">
      <SettingsHeader user={user} />
      <div className="card">
        <div>
          <h2 className="text-2xl">Borrar usuario</h2>
          <DeleteUserButton />
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
