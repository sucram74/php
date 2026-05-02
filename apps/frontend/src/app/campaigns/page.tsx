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

function formatPeriodDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(new Date(date))
    .replace(':', 'h');
}

export default function CampaignsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const [minimumValueInput, setMinimumValueInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const validateDates = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (end < start) {
      setToast('Data final não pode ser anterior à data inicial.');
      return false;
    }

    if (end < now) {
      setToast('Data final não pode ser anterior à data atual.');
      return false;
    }

    return true;
  };

  return (
    <div className='space-y-5'>
      <Toast message={toast} />
      <h1 className='text-2xl font-bold'>Campanhas</h1>

      <div className='grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-2'>
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
          <input type='datetime-local' className='w-full rounded-md border p-2' value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </label>

        <label className='space-y-1'>
          <span className='text-sm font-medium'>Data de término</span>
          <input type='datetime-local' className='w-full rounded-md border p-2' value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
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
            if (!validateDates()) return;

            if (editingId) {
              await api(`/campaigns/${editingId}`, { method: 'PATCH', body: JSON.stringify(form) });
              setToast('Campanha alterada com sucesso.');
            } else {
              await api('/campaigns', { method: 'POST', body: JSON.stringify(form) });
              setToast('Campanha criada com sucesso.');
            }
            setEditingId(null);
            setForm({ title: '', description: '', startDate: '', endDate: '', minimumValuePerCoupon: 0 });
            setMinimumValueInput('');
            void load();
          }}
        >
          {editingId ? 'Salvar alterações' : 'Criar campanha'}
        </Button>
      </div>

      <div className='space-y-3'>
        {items.map((item) => (
          <div key={item.id} className='space-y-2 rounded-md border p-4'>
            <p><strong>Nome:</strong> {item.title}</p>
            <p><strong>Descrição:</strong> {item.description}</p>
            <p><strong>Período:</strong> {formatPeriodDate(item.startDate)} até {formatPeriodDate(item.endDate)}</p>
            <p><strong>Valor mínimo:</strong> R$ {Number(item.minimumValuePerCoupon || 0).toFixed(2)}</p>
            <p><strong>Status:</strong> {item.active ? 'Ativa' : 'Inativa'}</p>
            <div className='flex gap-2'>
              <Button
                className='bg-white text-slate-800 hover:bg-slate-100'
                onClick={() => {
                  setEditingId(item.id);
                  setForm({
                    title: item.title,
                    description: item.description,
                    startDate: item.startDate.slice(0, 16),
                    endDate: item.endDate.slice(0, 16),
                    minimumValuePerCoupon: Number(item.minimumValuePerCoupon || 0),
                  });
                  setMinimumValueInput(formatBrlCurrency(String(Number(item.minimumValuePerCoupon || 0) * 100)));
                }}
              >
                Editar
              </Button>
              <Button
                onClick={async () => {
                  await api(`/campaigns/${item.id}/toggle-active`, { method: 'PATCH' });
                  setToast('Status da campanha atualizado com sucesso.');
                  void load();
                }}
              >
                Alterar status
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
