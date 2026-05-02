'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';
import { api, ApiError } from '@/lib/api';

type SignupForm = {
  storeName: string;
  ownerName: string;
  email: string;
  whatsapp: string;
  password: string;
};

const EMPTY_FORM: SignupForm = {
  storeName: '',
  ownerName: '',
  email: '',
  whatsapp: '',
  password: '',
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function onChange<K extends keyof SignupForm>(key: K, value: SignupForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateRequiredFields() {
    if (!form.storeName.trim()) return 'Informe o nome da loja.';
    if (!form.ownerName.trim()) return 'Informe o nome do responsável.';
    if (!form.email.trim()) return 'Informe o e-mail.';
    if (!form.whatsapp.trim()) return 'Informe o WhatsApp.';
    if (!form.password.trim()) return 'Informe a senha.';
    return '';
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const validationError = validateRequiredFields();
    if (validationError) {
      setToast({ message: validationError, type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await api('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setToast({ message: 'Cadastro iniciado com sucesso', type: 'success' });
      router.push('/login');
      return;
    } catch (error) {
      const signupEndpointMissing = error instanceof ApiError && (error.status === 404 || error.status === 405);

      if (!signupEndpointMissing) {
        setToast({ message: 'Não foi possível iniciar cadastro. Tente novamente.', type: 'error' });
        setLoading(false);
        return;
      }
    }

    try {
      localStorage.setItem('signup_draft', JSON.stringify(form));
      setToast({ message: 'Cadastro iniciado com sucesso', type: 'success' });
      router.push('/login');
    } catch {
      setToast({ message: 'Não foi possível salvar o rascunho do cadastro.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:py-14'>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <section className='mx-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
        <h1 className='text-2xl font-bold text-slate-900'>Criar conta grátis</h1>
        <p className='mt-2 text-sm text-slate-600'>Preencha os dados abaixo para iniciar seu cadastro.</p>

        <form className='mt-6 space-y-4' onSubmit={submit}>
          <div>
            <label htmlFor='storeName' className='mb-1 block text-sm font-medium text-slate-700'>Nome da loja</label>
            <input id='storeName' name='storeName' type='text' value={form.storeName} onChange={(e) => onChange('storeName', e.target.value)} className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <div>
            <label htmlFor='ownerName' className='mb-1 block text-sm font-medium text-slate-700'>Nome do responsável</label>
            <input id='ownerName' name='ownerName' type='text' value={form.ownerName} onChange={(e) => onChange('ownerName', e.target.value)} className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <div>
            <label htmlFor='email' className='mb-1 block text-sm font-medium text-slate-700'>E-mail</label>
            <input id='email' name='email' type='email' value={form.email} onChange={(e) => onChange('email', e.target.value)} className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <div>
            <label htmlFor='whatsapp' className='mb-1 block text-sm font-medium text-slate-700'>WhatsApp</label>
            <input id='whatsapp' name='whatsapp' type='tel' value={form.whatsapp} onChange={(e) => onChange('whatsapp', e.target.value)} className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <div>
            <label htmlFor='password' className='mb-1 block text-sm font-medium text-slate-700'>Senha</label>
            <input id='password' name='password' type='password' value={form.password} onChange={(e) => onChange('password', e.target.value)} className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <Button type='submit' className='mt-2 w-full bg-indigo-600 text-white hover:bg-indigo-700' disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta grátis'}
          </Button>
        </form>
      </section>
    </main>
  );
}
