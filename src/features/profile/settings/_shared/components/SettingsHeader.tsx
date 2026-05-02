import { Settings } from 'lucide-react';

import type { UserDTO } from '@/domain/user/types';

export const SettingsHeader = ({ user }: { user: UserDTO }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <p className="text-muted ml-12">
        Welcome back, <span className="font-medium text-foreground">{user.username}</span>
      </p>
    </div>
  );
};
