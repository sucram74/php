'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminPage() {
  const [d, setD] = useState<any>({});

  useEffect(() => {
    void Promise.all([api('/campaigns'), api('/consumers'), api('/coupons')]).then(([campaigns, consumers, coupons]) => {
      setD({ campaigns: campaigns.length, consumers: consumers.length, coupons: coupons.length });
    });
  }, []);

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Visão geral da plataforma SaaS</h1>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {[['Total de lojas', 1], ['Total de campanhas', d.campaigns ?? 0], ['Total de consumidores', d.consumers ?? 0], ['Total de cupons', d.coupons ?? 0]].map(([title, value]) => (
          <div key={String(title)} className='ui-card'><p className='text-sm text-slate-600'>{String(title)}</p><strong className='text-2xl'>{value as number}</strong></div>
        ))}
      </div>
      <div className='ui-card'>
        <h2 className='font-semibold'>Próximos módulos</h2>
        <p className='text-sm text-slate-600'>Assinaturas, auditoria e gestão de lojas (estrutura inicial preparada).</p>
      </div>
    </div>
  );
}
