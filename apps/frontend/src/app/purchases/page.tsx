'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function PurchasesPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [f, setF] = useState({ campaignId: '', cpf: '', name: '', phone: '', amount: 0 });

  const labels: { [k: string]: string } = { cpf: 'CPF', name: 'Nome', phone: 'Telefone' };

  useEffect(() => {
    void api('/campaigns').then(setCampaigns);
  }, []);

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Compras</h1>
      <div className='flex flex-wrap items-center gap-2 rounded-md border p-4'>
        {['cpf', 'name', 'phone'].map((k) => (
          <input
            key={k}
            className='rounded-md border p-2'
            placeholder={labels[k]}
            value={(f as any)[k]}
            onChange={(e) => setF({ ...f, [k]: e.target.value })}
          />
        ))}
        <select className='rounded-md border p-2' value={f.campaignId} onChange={(e) => setF({ ...f, campaignId: e.target.value })}>
          <option value=''>Selecione a campanha</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <input
          type='number'
          className='rounded-md border p-2'
          placeholder='Valor da compra'
          value={f.amount}
          onChange={(e) => setF({ ...f, amount: Number(e.target.value) })}
        />
        <Button
          onClick={async () => {
            const r = await api('/purchases', { method: 'POST', body: JSON.stringify(f) });
            setMsg(`Compra lançada com sucesso. Cupons gerados: ${r.couponsGenerated}`);
          }}
        >
          Lançar compra
        </Button>
      </div>
      <p>{msg}</p>
    </div>
  );
}
