'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { APP_VERSION } from '@/lib/app-config';
import { Button } from '@/components/ui/button';

type TokenPayload = { email?: string; tenantName?: string; storeName?: string };

const menuItems = [
  { key: 'dashboard', label: 'Painel da Loja' },
  { key: 'admin', label: 'Painel Marcus' },
  { key: 'consumers', label: 'Consumidores' },
  { key: 'campaigns', label: 'Campanhas' },
  { key: 'purchases', label: 'Compras' },
  { key: 'coupons', label: 'Cupons' },
];

function decodeToken(token: string | null): TokenPayload {
  if (!token) return {};
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return {}; }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/login' && !localStorage.getItem('token')) router.push('/login');
  }, [pathname, router]);

  const footerData = useMemo(() => {
    const tokenData = decodeToken(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    return { store: tokenData.tenantName || tokenData.storeName || 'Loja Demo', user: tokenData.email || 'admin@demo.com' };
  }, [pathname]);

  if (pathname === '/login') return <>{children}</>;

  return (
    <div className='flex h-screen overflow-hidden'>
      <aside className='w-64 h-screen shrink-0 bg-slate-900 p-4 text-white flex flex-col'>
        <h2 className='mb-6 text-xl font-bold'>Promo SaaS</h2>
        <nav className='space-y-1'>
          {menuItems.map((item) => (
            <Link key={item.key} className='block rounded-md px-3 py-2 hover:bg-white/20' href={`/${item.key}`}>
              {item.label}
            </Link>
          ))}
          <Button variant='secondary' className='w-full justify-start' onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}>
            Sair
          </Button>
        </nav>
        <div className='mt-auto border-t border-white/20 pt-4 text-sm text-white/90 space-y-1'>
          <p>Loja: {footerData.store}</p>
          <p>Usuário: {footerData.user}</p>
          <p>Versão: {APP_VERSION}</p>
        </div>
      </aside>
      <main className='flex-1 h-screen overflow-y-auto p-6'>
        <header className='mb-6 text-lg font-semibold'>{pathname === '/admin' ? 'Painel Marcus' : 'Painel da Loja'}</header>
        {children}
      </main>
    </div>
  );
}
