'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');

    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const token = data?.access_token;
      if (!token) {
        throw new Error('Token ausente na resposta de login');
      }

      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        setErr('Credenciais inválidas');
      } else {
        setErr('Erro ao realizar login. Tente novamente.');
      }
    }
  }

  return (
    <form onSubmit={submit} className='mx-auto mt-24 max-w-sm space-y-4 rounded-md border p-5'>
      <h1 className='text-2xl font-bold'>Login</h1>
      <label className='block space-y-1'>
        <span className='text-sm font-medium'>E-mail</span>
        <input className='w-full rounded-md border p-2' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className='block space-y-1'>
        <span className='text-sm font-medium'>Senha</span>
        <input
          type='password'
          className='w-full rounded-md border p-2'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <Button type='submit'>Entrar</Button>
      {err && <p className='text-sm text-red-600'>{err}</p>}
    </form>
  );
}
