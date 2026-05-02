import Link from 'next/link';

export default function LandingPage(){
  return <main className='mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8'>
    <section className='space-y-4 text-center'>
      <h1 className='text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl'>Crie promoções, gere cupons e sorteios auditáveis em minutos.</h1>
      <p className='mx-auto max-w-3xl text-slate-600'>O Promo SaaS ajuda lojistas a aumentar vendas, incentivar recompra e avisar clientes pelo WhatsApp.</p>
      <Link href='/login' className='inline-block rounded bg-blue-700 px-6 py-3 font-semibold text-white'>Começar grátis</Link>
    </section>
    <section className='grid gap-4 md:grid-cols-3'>
      <div className='ui-card'><h2 className='text-xl font-semibold'>Como funciona</h2><ol className='list-decimal pl-5 text-sm'><li>Cadastre sua loja.</li><li>Crie campanha promocional.</li><li>Registre compras e gere cupons automaticamente.</li><li>Realize sorteios e avise vencedores.</li></ol></div>
      <div className='ui-card'><h2 className='text-xl font-semibold'>Benefícios</h2><ul className='list-disc pl-5 text-sm'><li>Aumenta vendas e recompra.</li><li>Cria base de clientes.</li><li>Reduz controle manual.</li></ul></div>
      <div className='ui-card'><h2 className='text-xl font-semibold'>Planos</h2><p className='text-sm'>Comece com a primeira campanha grátis e compre créditos conforme crescimento.</p></div>
    </section>
  </main>
}
