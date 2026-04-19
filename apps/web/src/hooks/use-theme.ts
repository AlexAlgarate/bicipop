'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [state, setState] = useState<{ theme: Theme; mounted: boolean }>({
    theme: 'light',
    mounted: false,
  });

  useEffect(() => {
    const getSystemTheme = (): Theme => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    };

    const getStoredTheme = (): Theme | null => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme !== 'light' && storedTheme !== 'dark') return null;
      return storedTheme;
    };

    const applyTheme = (nextTheme: Theme) => {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      document.documentElement.style.colorScheme = nextTheme;
      localStorage.setItem('theme', nextTheme);
    };

    const initialTheme = getStoredTheme() ?? getSystemTheme();

    // Ensure DOM + storage are aligned with the theme React will render.
    applyTheme(initialTheme);
    const timeoutId = setTimeout(() => {
      setState({ theme: initialTheme, mounted: true });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const applyTheme = (nextTheme: Theme) => {
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    setState((prev) => ({ ...prev, theme: newTheme }));
  };

  return { theme: state.theme, toggleTheme, mounted: state.mounted };
};
