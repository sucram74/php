'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { APP_VERSION } from '@/lib/app-config';
import { Button } from '@/components/ui/button';
import { Tutorial } from './tutorial';
import { Toast } from './ui/toast';
import { HelpBot } from './help-bot';

const lojaMenu = [
  ['dashboard', 'Painel da Loja'],
  ['consumers', 'Consumidores'],
  ['campaigns', 'Campanhas'],
  ['purchases', 'Compras'],
  ['coupons', 'Cupons'],
  ['draws', 'Sorteios'],
  ['credits', 'Créditos'],
];

const adminMenu = [
  ['admin', 'Painel Marcus'],
  ['campaigns', 'Campanhas'],
  ['consumers', 'Consumidores'],
  ['coupons', 'Cupons'],
  ['draws', 'Sorteios'],
  ['credits', 'Créditos / Pacotes'],
];

function decodeToken(token: string | null) {
  if (!token) return {};
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowAdmin, setAllowAdmin] = useState(false);
  const [toast, setToast] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(Boolean(token));

    if (!isPublicRoute && !token) {
      router.replace('/login');
    }
  }, [isPublicRoute, pathname, router]);

  const footerData = useMemo(() => {
    const t: any = decodeToken(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    return {
      store: t.tenantName || t.storeName || 'Loja Demo',
      user: t.email || 'admin@demo.com',
      role: (t.role || 'store').toLowerCase(),
    };
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated || isPublicRoute) return;

    if (footerData.role !== 'admin' && pathname.startsWith('/admin')) router.replace('/dashboard');
    if (footerData.role === 'admin' && ['/dashboard', '/purchases'].includes(pathname)) router.replace('/admin');
  }, [footerData.role, isAuthenticated, isPublicRoute, pathname, router]);

  useEffect(() => {
    let x = 0;
    let y = 0;
    const onKey = (ev: KeyboardEvent) => {
      if (footerData.role === 'admin') return;
      if (ev.key.toLowerCase() === 'x') {
        x += 1;
        if (x >= 5) {
          setAllowAdmin(true);
          setToast('Menu administrativo liberado temporariamente.');
          x = 0;
        }
      } else if (ev.key.toLowerCase() === 'y') {
        y += 1;
        if (y >= 5) {
          setAllowAdmin(false);
          setToast('Menu administrativo ocultado.');
          y = 0;
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [footerData.role]);

  if (isPublicRoute) {
    return (
      <>
        <HelpBot isAuthenticated={false} />
        {children}
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menus = footerData.role === 'admin' ? adminMenu : [...lojaMenu, ...(allowAdmin ? adminMenu : [])];

  return (
    <div className='flex h-screen flex-col overflow-hidden md:flex-row'>
      <Tutorial />
      <HelpBot isAuthenticated />
      <Toast message={toast} onClose={() => setToast('')} />
      <div className='flex items-center justify-between bg-slate-900 px-4 py-3 text-white md:hidden'>
        <span className='font-bold'>Promo SaaS</span>
        <Button variant='secondary' onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? 'Fechar menu' : 'Menu'}</Button>
      </div>
      <aside className={`shrink-0 bg-slate-900 p-4 text-white flex flex-col md:h-screen md:w-64 ${menuOpen ? 'block' : 'hidden'} md:block`}>
        <h2 className='mb-6 text-xl font-bold'>Promo SaaS</h2>
        <nav className='grid grid-cols-2 gap-1 md:block md:space-y-1'>
          {menus.map(([k, l]) => (
            <Link key={String(k)} className='block rounded-md px-3 py-2 hover:bg-white/20' href={`/${k}`} onClick={() => setMenuOpen(false)}>
              {String(l)}
            </Link>
          ))}
          <Button variant='secondary' className='w-full justify-start' onClick={() => { localStorage.removeItem('tutorial_done'); }}>
            Ver tutorial novamente
          </Button>
          <Button variant='secondary' className='w-full justify-start' onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}>
            Sair
          </Button>
        </nav>
        <div className='mt-auto border-t border-white/20 pt-4 text-sm'>
          <p>Loja: {footerData.store}</p>
          <p>Usuário: {footerData.user}</p>
          <p>Versão: {APP_VERSION}</p>
        </div>
      </aside>
      <main className='flex-1 overflow-y-auto p-4 md:h-screen md:p-6'>{children}</main>
    </div>
  );
}
