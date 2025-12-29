'use client';

import { clsx } from 'clsx';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Fragment, useEffect, useState } from 'react';

import { Button } from './ui/button';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const invertTheme = () => (resolvedTheme === 'light' ? setTheme('dark') : setTheme('light'));

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button variant="outline" size="icon" onClick={invertTheme}>
      {mounted && (
        <Fragment>
          <Sun
            className={clsx(
              'h-[1.2rem] w-[1.2rem] transition-all dark:rotate-0 dark:scale-100',
              resolvedTheme === 'dark' ? 'rotate-0 scale-100' : 'rotate90 scale-0'
            )}
          />
          <Moon
            className={clsx(
              'absolute h-[1.2rem] w-[1.2rem] transition-all dark:-rotate-90 dark:scale-0',
              resolvedTheme === 'light' ? 'rotate-0 scale-100' : 'rotate90 scale-0'
            )}
          />
        </Fragment>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
