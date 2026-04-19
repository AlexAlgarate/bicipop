'use client';

import { Button } from '@/components/ui/Button';
import { Share2 } from 'lucide-react';

export const ShareButton = () => {
  const handleClick = (): void => {
    console.log('Shared button feature not implemented yet');
    navigator.share?.({
      title: document.title,
      url: window.location.href,
    });
  };

  return (
    <Button
      onClick={handleClick}
      className="p-2 hover:bg-secondary text-muted-foreground"
    >
      <Share2 className="w-5 h-5" />
    </Button>
  );
};
