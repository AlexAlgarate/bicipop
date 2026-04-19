'use client';

import { useEffect } from 'react';

export const useCloseMenuClickingOutside = (
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void,
  active: boolean = true,
) => {
  useEffect(() => {
    if (!active) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [active, handler, ref]);
};
