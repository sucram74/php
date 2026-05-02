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

function maskCpf(cpf: string) {
  const formatted = formatCpf(cpf);
  return formatted.replace(/^(\d{3})\.\d{3}\.\d{3}-(\d{2})$/, '$1.XXX.XXX-$2');
}

function maskName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return name;

  const ignoredParts = new Set(['da', 'de', 'di', 'do', 'du', 'das', 'dos', 'e']);
  const initials = parts
    .slice(1)
    .filter((part) => !ignoredParts.has(part.toLowerCase()))
    .map((part) => part[0].toUpperCase())
    .join('');

  return initials ? `${parts[0]} ${initials}` : parts[0];
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) return phone;
  if (digits.length === 11) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-XX${digits.slice(9)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-XX${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)} ${digits.slice(2, digits.length - 2)}-XX${digits.slice(-2)}`;
}

export default function ConsumersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [cpf, setCpf] = useState('');
  const [toast, setToast] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const validateConsumerForm = () => {
    if (!form.name.trim()) {
      setToast('Nome é obrigatório.');
      return false;
    }
    if (!form.phone.trim()) {
      setToast('Telefone é obrigatório.');
      return false;
    }
    if (!isValidCpf(form.cpf)) {
      setToast('CPF inválido.');
      return false;
    }
    return true;
  };

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
          Buscar
        </Button>
        <Button
          className='bg-white text-slate-800 hover:bg-slate-100'
          onClick={() => {
            setCpf('');
            setEditingId(null);
            setForm({ cpf: '', name: '', phone: '' });
            void load();
          }}
        >
          Limpar
        </Button>
      </div>

      <div className='space-y-3 rounded-md border p-4'>
        <label className='block space-y-1'>
          <span className='text-sm font-medium'>CPF</span>
          <input
            className='w-full rounded-md border p-2'
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })}
            onBlur={() => {
              if (form.cpf && !isValidCpf(form.cpf)) setToast('CPF inválido.');
            }}
          />
        </label>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          <label className='space-y-1 md:col-span-2'>
            <span className='text-sm font-medium'>Nome</span>
            <input className='w-full rounded-md border p-2' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className='space-y-1'>
            <span className='text-sm font-medium'>Telefone</span>
            <input className='w-full rounded-md border p-2' value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
        </div>

        <Button
          className='w-fit'
          onClick={async () => {
            if (!validateConsumerForm()) return;

            const payload = { ...form, cpf: form.cpf.replace(/\D/g, '') };
            if (editingId) {
              await api(`/consumers/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
              setToast('Consumidor atualizado com sucesso.');
            } else {
              await api('/consumers', { method: 'POST', body: JSON.stringify(payload) });
              setToast('Consumidor cadastrado com sucesso.');
            }
            setEditingId(null);
            setForm({ cpf: '', name: '', phone: '' });
            void load();
          }}
        >
          {editingId ? 'Salvar alterações' : 'Cadastrar consumidor'}
        </Button>
      </div>

      <table className='w-full overflow-hidden rounded-md border border-collapse'>
        <thead className='bg-slate-100'>
          <tr>
            <th className='p-3 text-left'>CPF</th>
            <th className='p-3 text-left'>Nome</th>
            <th className='p-3 text-left'>Telefone</th>
            <th className='p-3 text-left'>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className='border-t'>
              <td className='p-3'>{maskCpf(item.cpf)}</td>
              <td className='p-3'>{maskName(item.name)}</td>
              <td className='p-3'>{maskPhone(item.phone)}</td>
              <td className='p-3'>
                <Button
                  className='bg-white text-slate-800 hover:bg-slate-100'
                  onClick={() => {
                    setEditingId(item.id);
                    setForm({ cpf: formatCpf(item.cpf), name: item.name, phone: item.phone });
                  }}
                >
                  Alterar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
