'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  resolved: 'light',
  setTheme: () => {},
  cycleTheme: () => {},
});

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(resolved) {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system');
  const [resolved, setResolved] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('captioner-theme');
    const initial =
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : 'system';
    setThemeState(initial);
  }, []);

  useEffect(() => {
    const next = theme === 'system' ? getSystemTheme() : theme;
    setResolved(next);
    applyTheme(next);
    localStorage.setItem('captioner-theme', theme);

    if (theme !== 'system') return undefined;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const sys = getSystemTheme();
      setResolved(sys);
      applyTheme(sys);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  function setTheme(next) {
    setThemeState(next);
  }

  function cycleTheme() {
    setThemeState((current) => {
      if (current === 'system') return 'light';
      if (current === 'light') return 'dark';
      return 'system';
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
