import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className='px-4 py-8 sm:py-12'>
      <section className='mx-auto w-full max-w-md space-y-4 rounded-md border bg-white p-5 text-center sm:p-6'>
        <h1 className='text-2xl font-bold'>Começar grátis</h1>
        <p className='text-sm text-slate-600'>
          Criação de conta em configuração. Enquanto isso, faça login para acessar o produto.
        </p>
        <Link
          href='/login'
          className='inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:w-auto'
        >
          Ir para login
        </Link>
      </section>
    </main>
  );
}
