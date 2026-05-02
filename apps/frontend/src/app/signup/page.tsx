export default function SignupPage() {
  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:py-14'>
      <section className='mx-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
        <h1 className='text-2xl font-bold text-slate-900'>Criar conta grátis</h1>
        <p className='mt-2 text-sm text-slate-600'>Preencha os dados abaixo para iniciar seu cadastro.</p>

        <form className='mt-6 space-y-4'>
          <div>
            <label htmlFor='storeName' className='mb-1 block text-sm font-medium text-slate-700'>Nome da loja</label>
            <input id='storeName' name='storeName' type='text' className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <div>
            <label htmlFor='ownerName' className='mb-1 block text-sm font-medium text-slate-700'>Nome do responsável</label>
            <input id='ownerName' name='ownerName' type='text' className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <div>
            <label htmlFor='email' className='mb-1 block text-sm font-medium text-slate-700'>E-mail</label>
            <input id='email' name='email' type='email' className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <div>
            <label htmlFor='whatsapp' className='mb-1 block text-sm font-medium text-slate-700'>WhatsApp</label>
            <input id='whatsapp' name='whatsapp' type='tel' className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <div>
            <label htmlFor='password' className='mb-1 block text-sm font-medium text-slate-700'>Senha</label>
            <input id='password' name='password' type='password' className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2' />
          </div>

          <button type='button' className='mt-2 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700'>
            Criar conta grátis
          </button>
        </form>
      </section>
    </main>
  );
}
