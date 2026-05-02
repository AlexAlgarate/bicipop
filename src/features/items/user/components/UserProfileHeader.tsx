import { User, Bike, Calendar } from 'lucide-react';

import { formatDate } from '@/utils/format';

interface UserProfileHeaderProps {
  username: string;
  productsCount: number;
  createdAt: Date;
}

export const UserProfileHeader = ({
  username,
  productsCount,
  createdAt,
}: UserProfileHeaderProps) => {
  return (
    <div className="mb-8 bg-card border border-border rounded-lg py-8 md:p-8">
      <div className="flex items-center gap-6 md:flex-row mx-auto px-4">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-12 h-12 text-primary" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground mb-3">{username}</h1>
          <div className="mt-2 flex flex-col items-start justify-center gap-1 text-base text-muted md:justify-start">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Member since {formatDate(createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Bike className="h-4 w-4" />
              {productsCount} product
              {productsCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
