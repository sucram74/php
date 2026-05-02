'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';

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
    <form onSubmit={submit} className='max-w-sm mx-auto mt-24 space-y-3'>
      <h1 className='text-2xl font-bold'>Login</h1>
      <input className='border p-2 w-full' value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type='password'
        className='border p-2 w-full'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='bg-black text-white px-4 py-2'>Entrar</button>
      {err && <p>{err}</p>}
    </form>
  );
}
