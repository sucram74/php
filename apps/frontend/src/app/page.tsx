import Link from 'next/link';

export default function LandingPage(){
  return <main className='mx-auto max-w-5xl space-y-10 p-8'>
    <section className='space-y-4 text-center'>
      <h1 className='text-4xl font-bold'>Crie promoções, gere cupons e sorteios auditáveis em minutos.</h1>
      <p className='text-slate-600'>O Promo SaaS ajuda lojistas a aumentar vendas, incentivar recompra e avisar clientes pelo WhatsApp.</p>
      <Link href='/login' className='inline-block rounded bg-blue-700 px-6 py-3 font-semibold text-white'>Começar grátis</Link>
    </section>
    <section><h2 className='text-2xl font-semibold'>Como funciona</h2><ol className='list-decimal pl-6'><li>Cadastre sua loja.</li><li>Crie campanha promocional.</li><li>Registre compras e gere cupons automaticamente.</li><li>Realize sorteios e avise vencedores pelo WhatsApp.</li></ol></section>
    <section><h2 className='text-2xl font-semibold'>Benefícios</h2><ul className='list-disc pl-6'><li>Aumenta vendas e recompra.</li><li>Cria base de clientes.</li><li>Reduz controle manual.</li><li>Profissionaliza promoções.</li></ul></section>
    <section><h2 className='text-2xl font-semibold'>Planos e pacotes</h2><p>Comece com sua primeira campanha grátis e compre créditos conforme crescimento.</p></section>
    <section><h2 className='text-2xl font-semibold'>FAQ</h2><p><strong>Preciso instalar algo?</strong> Não, acesso web.</p><p><strong>Tem WhatsApp?</strong> Sim, para avisos e relacionamento.</p></section>
  </main>
}
