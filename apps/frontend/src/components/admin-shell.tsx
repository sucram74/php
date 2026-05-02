'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type TokenPayload = {
  email?: string;
  tenantName?: string;
  storeName?: string;
};

const menuItems = [
  { key: 'dashboard', label: 'Painel' },
  { key: 'consumers', label: 'Consumidores' },
  { key: 'campaigns', label: 'Campanhas' },
  { key: 'purchases', label: 'Compras' },
  { key: 'coupons', label: 'Cupons' },
];

function decodeToken(token: string | null): TokenPayload {
  if (!token) return {};
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/login' && !localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [pathname, router]);

  const footerData = useMemo(() => {
    const tokenData = decodeToken(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    return {
      store: tokenData.tenantName || tokenData.storeName || 'Loja Demo',
      user: tokenData.email || 'admin@demo.com',
      version: 'v0.1.0 - Local',
    };
  }, [pathname]);

  if (pathname === '/login') return <>{children}</>;

  return (
    <div className='flex min-h-screen'>
      <aside className='w-64 min-h-screen bg-slate-900 p-4 text-white flex flex-col'>
        <h2 className='mb-6 text-xl font-bold'>Promo SaaS</h2>

        <nav className='space-y-1'>
          {menuItems.map((item) => (
            <Link
              key={item.key}
              className='block cursor-pointer rounded-md px-3 py-2 transition-colors duration-200 hover:bg-white/25'
              href={`/${item.key}`}
            >
              {item.label}
            </Link>
          ))}
          <button
            className='w-full text-left cursor-pointer rounded-md px-3 py-2 transition-colors duration-200 hover:bg-white/25'
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
          >
            Sair
          </button>
        </nav>

        <div className='mt-auto border-t border-white/20 pt-4 text-sm text-white/90 space-y-1'>
          <p>Loja: {footerData.store}</p>
          <p>Usuário: {footerData.user}</p>
          <p>Versão: {footerData.version}</p>
        </div>
      </aside>

      <main className='flex-1 p-6'>
        <header className='mb-6 text-lg font-semibold'>Painel da Loja</header>
        {children}
      </main>
    </div>
  );
}
