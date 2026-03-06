"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/images', label: 'Imágenes IA' },
  { href: '/asteroids', label: 'Asteroides' },
  { href: '/stocks', label: 'Mercado' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[var(--foreground)] font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          SOA Gateway
        </Link>
        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-glow)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
