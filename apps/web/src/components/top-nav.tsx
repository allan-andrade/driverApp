import Link from 'next/link';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/instructors', label: 'Instrutores' },
  { href: '/login', label: 'Entrar' },
  { href: '/register', label: 'Criar conta' },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/70 backdrop-blur">
      <nav className="shell flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-ink">
          DriveSchool Market
        </Link>
        <div className="flex gap-5 text-sm font-medium text-slate-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
