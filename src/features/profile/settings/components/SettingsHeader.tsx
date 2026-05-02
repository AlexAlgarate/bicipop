import type { UserDTO } from '@/domain/user/types';

export const SettingsHeader = ({ user }: { user: UserDTO }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted">
          Welcome back, {user.username}! Manage your user settings here.
        </p>
      </div>
    </div>
  );
};
