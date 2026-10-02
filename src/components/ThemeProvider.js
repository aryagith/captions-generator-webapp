'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  resolved: 'light',
  setTheme: () => {},
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored;
    try { stored = localStorage.getItem('captioner-theme'); } catch {}
    const initial =
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : 'system';
    setThemeState(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const next = theme === 'system' ? getSystemTheme() : theme;
    setResolved(next);
    applyTheme(next);
    try { localStorage.setItem('captioner-theme', theme); } catch {}

    if (theme !== 'system') return undefined;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const sys = getSystemTheme();
      setResolved(sys);
      applyTheme(sys);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme, ready]);

  function setTheme(next) {
    setThemeState(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
