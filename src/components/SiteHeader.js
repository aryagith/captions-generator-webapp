'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import CCIcon from './CCIcon';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 mb-10">
      <div className="glass-nav rounded-full px-4 py-2.5 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold tracking-wide text-[var(--ink)]"
        >
          <CCIcon />
          <span className="text-sm sm:text-base">Captioner</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-2 text-sm text-[var(--ink)]">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? 'rounded-full px-3 py-1.5 font-semibold bg-[var(--nav-active-bg)] text-[var(--nav-active-fg)]'
                    : 'rounded-full px-3 py-1.5 opacity-75 hover:opacity-100'
                }
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="mailto:aryagsv@gmail.com"
            className="rounded-full px-3 py-1.5 opacity-75 hover:opacity-100"
          >
            Contact
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="w-8 h-8 rounded-full glass-nav inline-flex items-center justify-center text-[var(--ink)]"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden mt-2 glass-panel rounded-2xl p-3 flex flex-col gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:aryagsv@gmail.com"
            className="rounded-xl px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
}
