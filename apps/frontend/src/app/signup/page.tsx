'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ storeName: '', ownerName: '', email: '', whatsapp: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('signup_lead_preview', JSON.stringify({ ...form, createdAt: new Date().toISOString() }));
    setLoading(false);
    router.push('/login?fromSignup=1');
  }

  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:py-14'>
      <section className='mx-auto grid w-full max-w-5xl gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10'>
        <div className='space-y-4'>
          <span className='inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700'>Cadastro gratuito</span>
          <h1 className='text-3xl font-bold tracking-tight'>Crie sua conta grátis no Promo SaaS</h1>
          <p className='text-slate-600'>Comece o onboarding comercial da sua loja e publique campanhas promocionais com aparência profissional.</p>
          <ul className='space-y-2 text-sm text-slate-600'>
            <li>• Setup guiado em poucos minutos</li>
            <li>• Campanhas com cupons e sorteios auditáveis</li>
            <li>• Painel com dados de performance</li>
          </ul>
          <p className='rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800'>Fluxo visual ativo: o endpoint de cadastro ainda não foi integrado no backend nesta etapa.</p>
          <p className='text-xs text-slate-500'>Já tem conta? <Link href='/login' className='font-medium text-indigo-700 underline'>Fazer login</Link></p>
        </div>

        <form onSubmit={submit} className='space-y-3'>
          <label className='block space-y-1'><span className='text-sm font-medium'>Nome da loja</span><input required className='ui-input' value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} /></label>
          <label className='block space-y-1'><span className='text-sm font-medium'>Nome do responsável</span><input required className='ui-input' value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} /></label>
          <label className='block space-y-1'><span className='text-sm font-medium'>E-mail</span><input required type='email' className='ui-input' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className='block space-y-1'><span className='text-sm font-medium'>WhatsApp</span><input required className='ui-input' value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder='(11) 99999-9999' /></label>
          <label className='block space-y-1'><span className='text-sm font-medium'>Senha</span><input required minLength={6} type='password' className='ui-input' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>

          <Button type='submit' className='mt-2 w-full'>{loading ? 'Criando...' : 'Criar conta grátis'}</Button>
          <p className='text-xs text-slate-500'>Ao continuar, você concorda com os termos e política de privacidade.</p>
        </form>
      </section>
    </main>
  );
}
