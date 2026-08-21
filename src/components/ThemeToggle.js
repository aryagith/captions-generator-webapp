'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, resolved, cycleTheme } = useTheme();

  const label =
    theme === 'system'
      ? `Theme: system (${resolved})`
      : `Theme: ${theme}`;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className="w-8 h-8 rounded-full glass-nav inline-flex items-center justify-center text-sm text-[var(--ink)]"
    >
      {resolved === 'dark' ? '☾' : '☀'}
    </button>
  );
}
