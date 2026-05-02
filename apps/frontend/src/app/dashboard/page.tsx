'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [d, setD] = useState<any>({});
  const r = useRouter();
  useEffect(() => {
    void Promise.all([api('/campaigns'), api('/consumers'), api('/purchases'), api('/coupons'), api('/draws'), api('/credits/balance')]).then(([c, co, p, cu, dr, b]) =>
      setD({ c: c.length, co: co.length, p: p.length, cu: cu.length, dr: dr.length, cs: (dr || []).reduce((a: any, x: any) => a + x.quantity, 0), bal: b.balance }),
    );
  }, []);

  const cards = [['Campanhas', d.c], ['Consumidores', d.co], ['Compras', d.p], ['Cupons', d.cu], ['Sorteios', d.dr], ['Cupons sorteados', d.cs], ['Saldo de créditos', d.bal]];
  return <div className='space-y-4'><h1 className='text-2xl font-bold'>Painel da Loja</h1><div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>{cards.map(([t, v]) => <div key={String(t)} className='ui-card'><p className='text-sm text-slate-600'>{String(t)}</p><strong className='text-2xl'>{v ?? 0}</strong></div>)}</div><div className='ui-card'><Button className='w-full sm:w-auto' onClick={() => r.push('/credits')}>Comprar créditos</Button></div></div>;
}
