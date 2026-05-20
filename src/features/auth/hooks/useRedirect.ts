import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { routes } from '@/config/routes';

interface useRedirectProps {
  success: boolean;
}

export const useRedirect = (state: useRedirectProps) => {
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push(routes.home);
    }
  }, [router, state.success]);
};
