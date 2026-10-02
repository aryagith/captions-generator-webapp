'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { resolved, setTheme } = useTheme();
  const isDark = resolved === 'dark';
  const label = `Switch to ${isDark ? 'light' : 'dark'} mode`;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className="h-11 px-3 rounded-full glass-nav inline-flex gap-2 items-center justify-center text-xs text-[var(--ink)] hover:bg-[var(--input-bg)] transition-colors"
    >
      <span aria-hidden="true" className="text-base">{isDark ? '☾' : '☀'}</span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
