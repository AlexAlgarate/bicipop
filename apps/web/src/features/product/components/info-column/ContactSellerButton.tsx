'use client';

import { Button } from '@/components/ui/Button';

export const ContactSellerButton = () => {
  const handleClick = () => {
    console.log('Feature not implemented yet.');
  };

  return (
    <Button
      onClick={handleClick}
      className="flex-1 flex items-center justify-center gap-2
          border border-gary-200 hover:bg-gray-200 hover:border-gray-400
          text-gay-700 font-medium py-2.5 rounded-lg
          dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800
          "
    >
      Contactar al vendedor *
    </Button>
  );
};
