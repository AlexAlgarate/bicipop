import Link from 'next/link';
import { SearchX } from 'lucide-react';

import { routes } from '@/config/routes';

const UserNotFound = () => {
  return (
    <div className="min-h-[calc(75vh-64px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md p-4 rounded-lg shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-secondary rounded-full p-5">
            <SearchX className="w-14 h-14 text-muted-foreground" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-3">User Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we could not find the page you are looking for. The user might have been
          removed, renamed or did not exist in the first place.
        </p>

        <Link
          href={routes.home}
          className="
          inline-flex items-center gap-2 bg-primary hover:bg-primary-hover
          text-primary-foreground font-medium px-6 py-2.5
          rounded-lg transition-colors
          "
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default UserNotFound;
