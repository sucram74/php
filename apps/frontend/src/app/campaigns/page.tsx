'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

function formatBrlCurrency(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const number = Number(digits) / 100;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
}

function parseCurrencyToNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) / 100 : 0;
}

export default function CampaignsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const [minimumValueInput, setMinimumValueInput] = useState('');
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '', minimumValuePerCoupon: 0 });

  const load = () => api('/campaigns').then(setItems);

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <div className='space-y-5'>
      <Toast message={toast} />
      <h1 className='text-2xl font-bold'>Campanhas</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md border p-4'>
        <label className='space-y-1'>
          <span className='text-sm font-medium'>Nome da campanha</span>
          <input className='w-full rounded-md border p-2' value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>

        <label className='space-y-1'>
          <span className='text-sm font-medium'>Descrição</span>
          <input className='w-full rounded-md border p-2' value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>

        <label className='space-y-1'>
          <span className='text-sm font-medium'>Data de início</span>
          <input type='date' className='w-full rounded-md border p-2' value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </label>

        <label className='space-y-1'>
          <span className='text-sm font-medium'>Data de término</span>
          <input type='date' className='w-full rounded-md border p-2' value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </label>

        <label className='space-y-1 md:col-span-2'>
          <span className='text-sm font-medium'>Valor mínimo para gerar 1 cupom (R$)</span>
          <input
            className='w-full rounded-md border p-2'
            placeholder='Ex: 50'
            value={minimumValueInput}
            onChange={(e) => {
              const masked = formatBrlCurrency(e.target.value);
              setMinimumValueInput(masked);
              setForm({ ...form, minimumValuePerCoupon: parseCurrencyToNumber(masked) });
            }}
          />
        </label>

        <Button
          className='w-fit'
          onClick={async () => {
            await api('/campaigns', { method: 'POST', body: JSON.stringify(form) });
            setToast('Campanha criada com sucesso.');
            setForm({ title: '', description: '', startDate: '', endDate: '', minimumValuePerCoupon: 0 });
            setMinimumValueInput('');
            load();
          }}
        >
          Criar
        </Button>
      </div>

      <div className='space-y-3'>
        {items.map((item) => (
          <div key={item.id} className='rounded-md border p-4 space-y-2'>
            <p><strong>Nome:</strong> {item.title}</p>
            <p><strong>Descrição:</strong> {item.description}</p>
            <p><strong>Período:</strong> {item.startDate} até {item.endDate}</p>
            <p><strong>Valor mínimo:</strong> R$ {Number(item.minimumValuePerCoupon || 0).toFixed(2)}</p>
            <p><strong>Status:</strong> {item.active ? 'Ativa' : 'Inativa'}</p>
            <Button
              onClick={async () => {
                await api(`/campaigns/${item.id}/toggle-active`, { method: 'PATCH' });
                setToast('Status da campanha atualizado com sucesso.');
                load();
              }}
            >
              Alterar status
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
