'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function isValidCpf(value: string) {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calcDigit = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i += 1) total += Number(base[i]) * (factor - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const digit1 = calcDigit(cpf.slice(0, 9), 10);
  const digit2 = calcDigit(cpf.slice(0, 10), 11);
  return digit1 === Number(cpf[9]) && digit2 === Number(cpf[10]);
}

export default function ConsumersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [cpf, setCpf] = useState('');
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ cpf: '', name: '', phone: '' });

  const load = () => api('/consumers').then(setItems);

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
      <h1 className='text-2xl font-bold'>Consumidores</h1>

      <div className='flex flex-wrap items-end gap-3 rounded-md border p-4'>
        <label className='space-y-1'>
          <span className='text-sm font-medium'>CPF</span>
          <input className='rounded-md border p-2' placeholder='Digite o CPF' value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))} />
        </label>
        <Button
          onClick={async () => {
            if (!isValidCpf(cpf)) {
              setToast('CPF inválido.');
              return;
            }
            try {
              const result = await api(`/consumers/by-cpf/${cpf.replace(/\D/g, '')}`);
              if (!result) {
                setToast('CPF não encontrado.');
                return;
              }
              setItems([result]);
            } catch (error) {
              if (error instanceof ApiError && error.status === 404) setToast('CPF não encontrado.');
            }
          }}
        >
          Buscar CPF
        </Button>
        <Button
          className='bg-white text-slate-800 hover:bg-slate-100'
          onClick={() => {
            setCpf('');
            setForm({ cpf: '', name: '', phone: '' });
            load();
          }}
        >
          Limpar
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3 rounded-md border p-4'>
        <label className='space-y-1'>
          <span className='text-sm font-medium'>CPF</span>
          <input className='rounded-md border p-2' value={form.cpf} onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })} />
        </label>
        <label className='space-y-1'>
          <span className='text-sm font-medium'>Nome</span>
          <input className='rounded-md border p-2' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className='space-y-1'>
          <span className='text-sm font-medium'>Telefone</span>
          <input className='rounded-md border p-2' value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <Button
          className='w-fit'
          onClick={async () => {
            if (!isValidCpf(form.cpf)) {
              setToast('CPF inválido.');
              return;
            }
            await api('/consumers', { method: 'POST', body: JSON.stringify({ ...form, cpf: form.cpf.replace(/\D/g, '') }) });
            setForm({ cpf: '', name: '', phone: '' });
            setToast('Consumidor cadastrado com sucesso.');
            load();
          }}
        >
          Cadastrar
        </Button>
      </div>

      <table className='w-full border-collapse rounded-md overflow-hidden border'>
        <thead className='bg-slate-100'>
          <tr>
            <th className='p-3 text-left'>CPF</th>
            <th className='p-3 text-left'>Nome</th>
            <th className='p-3 text-left'>Telefone</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className='border-t'>
              <td className='p-3'>{formatCpf(item.cpf)}</td>
              <td className='p-3'>{item.name}</td>
              <td className='p-3'>{item.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
