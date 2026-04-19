'use client';

import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="w-10 h-10"></div>;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 w-9 h-9 rounded-full bg-orange-50 hover:bg-orange-100/50 border border-orange-400/20
    flex items-center justify-center transition colors ring-1 ring-orange-200/20
    focus:outline-none 
    dark:bg-primary/10 dark:hover:bg-primary/20 dark:border-primary/20
    duration-200 cursor-pointer"
      aria-label="Cambiar tema"
    >
      {theme === 'light' ? (
        <Sun className="w-5.5 h-5.5 text-orange-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-500" />
      )}
    </button>
  );
};
