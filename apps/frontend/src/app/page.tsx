import Link from 'next/link';

const trustLogos = ['Aurora Retail', 'Nova Moda', 'Casa Prime', 'TrendLab', 'Viva Store'];

const benefits = [
  { title: 'Mais vendas em campanhas sazonais', text: 'Ative mecânicas promocionais com urgência e aumente a conversão sem depender de operação manual.' },
  { title: 'Leads qualificados para remarketing', text: 'Capture dados com consentimento e organize participantes para novas ações comerciais.' },
  { title: 'Gestão centralizada e segura', text: 'Controle regras, cupons, compras e sorteios auditáveis em um único painel.' },
  { title: 'Decisões baseadas em resultado', text: 'Acompanhe desempenho de campanhas em tempo real com métricas de participação e retorno.' },
];

const howItWorks = [
  'Crie a campanha com objetivo, período e regras.',
  'Personalize mecânica de participação e critérios promocionais.',
  'Publique e divulgue em canais como WhatsApp, Instagram e loja física.',
  'Monitore resultados e otimize as próximas campanhas com dados reais.',
];

const faqs = [
  { q: 'Preciso de cartão para começar o teste?', a: 'Não. Você pode iniciar o onboarding e publicar sua primeira campanha sem cartão de crédito.' },
  { q: 'Quanto tempo levo para lançar minha primeira campanha?', a: 'Com o fluxo guiado, a maioria das lojas publica em poucos minutos.' },
  { q: 'O sorteio é auditável?', a: 'Sim. O sistema registra regras, cupons gerados e vencedores para garantir rastreabilidade.' },
  { q: 'Consigo usar com minha operação atual?', a: 'Sim. O Promo SaaS foi pensado para e-commerces e operações omnichannel com adoção rápida.' },
];

export default function LandingPage() {
  return (
    <main className='bg-slate-50 text-slate-900'>
      <section className='mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pt-16'>
        <div className='space-y-6'>
          <span className='inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700'>SaaS de promoções e sorteios para varejo</span>
          <h1 className='text-4xl font-bold leading-tight tracking-tight sm:text-5xl'>Crie campanhas promocionais que vendem mais — em minutos.</h1>
          <p className='max-w-xl text-lg text-slate-600'>Lance sorteios, cupons e promoções com painel completo, automação e rastreio de performance para crescer com previsibilidade.</p>
          <div className='flex flex-wrap gap-3'>
            <Link href='/signup' className='rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700'>Começar grátis</Link>
            <a href='#mockups' className='rounded-md border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400'>Ver demo em 2 min</a>
          </div>
          <p className='text-sm text-slate-500'>Sem cartão de crédito • Setup rápido • Cancelamento simples</p>
        </div>
        <div className='relative'>
          <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-xl'>
            <div className='rounded-xl bg-slate-900 p-4 text-slate-100'>
              <p className='text-sm text-slate-300'>Dashboard de campanhas</p>
              <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                <div className='rounded-lg bg-slate-800 p-3'><p className='text-xs text-slate-300'>Campanhas ativas</p><p className='text-2xl font-bold'>12</p></div>
                <div className='rounded-lg bg-slate-800 p-3'><p className='text-xs text-slate-300'>Leads gerados</p><p className='text-2xl font-bold'>8.4k</p></div>
                <div className='rounded-lg bg-slate-800 p-3'><p className='text-xs text-slate-300'>Conversão média</p><p className='text-2xl font-bold'>18.7%</p></div>
              </div>
              <div className='mt-4 h-24 rounded-lg bg-gradient-to-r from-indigo-500/40 to-cyan-400/40' />
            </div>
          </div>
        </div>
      </section>

      <section className='border-y border-slate-200 bg-white'>
        <div className='mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8'>
          <p className='text-sm font-medium text-slate-500'>Confiado por marcas que aceleram vendas</p>
          <div className='grid gap-3 sm:grid-cols-5'>
            {trustLogos.map((logo) => <div key={logo} className='rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-600'>{logo}</div>)}
          </div>
          <div className='grid gap-3 text-sm text-slate-600 sm:grid-cols-3'>
            <p><strong className='text-slate-900'>+2.300</strong> campanhas criadas</p>
            <p><strong className='text-slate-900'>+145 mil</strong> leads gerados</p>
            <p><strong className='text-slate-900'>R$ 18 mi</strong> em vendas impactadas</p>
          </div>
        </div>
      </section>

      <section className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold tracking-tight'>O que é o Promo SaaS</h2>
        <p className='mt-4 max-w-3xl text-slate-600'>Uma plataforma comercial para planejar, lançar e otimizar campanhas promocionais com cupons e sorteios auditáveis. Centralize operação, acelere execução e acompanhe ROI por campanha.</p>
      </section>

      <section className='mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold tracking-tight'>Benefícios para seu time de marketing</h2>
        <div className='mt-8 grid gap-4 md:grid-cols-2'>
          {benefits.map((item) => <article key={item.title} className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'><h3 className='text-lg font-semibold'>{item.title}</h3><p className='mt-2 text-slate-600'>{item.text}</p></article>)}
        </div>
      </section>

      <section className='bg-white'>
        <div className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold tracking-tight'>Como funciona</h2>
          <ol className='mt-8 grid gap-4 md:grid-cols-2'>
            {howItWorks.map((step, idx) => <li key={step} className='rounded-xl border border-slate-200 p-5'><span className='text-sm font-semibold text-indigo-700'>Passo {idx + 1}</span><p className='mt-2 text-slate-700'>{step}</p></li>)}
          </ol>
        </div>
      </section>

      <section id='mockups' className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold tracking-tight'>Veja o produto em ação</h2>
        <div className='mt-8 grid gap-4 lg:grid-cols-3'>
          {['Dashboard', 'Campanhas', 'Participantes'].map((tab) => <div key={tab} className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'><p className='font-semibold'>{tab}</p><div className='mt-3 h-40 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200' /></div>)}
        </div>
      </section>

      <section className='bg-white'>
        <div className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold tracking-tight'>Planos para testar, crescer e escalar</h2>
          <div className='mt-8 grid gap-4 lg:grid-cols-3'>
            {[
              ['Start', 'Para iniciar campanhas promocionais', 'Começar grátis'],
              ['Pro', 'Mais automações e relatórios avançados', 'Começar grátis'],
              ['Scale', 'Operações de alto volume e suporte dedicado', 'Falar com vendas'],
            ].map(([name, text, cta], idx) => <article key={String(name)} className={`rounded-xl border p-6 ${idx === 1 ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200 bg-white'}`}><h3 className='text-xl font-semibold'>{name}</h3><p className='mt-2 text-slate-600'>{text}</p><Link href={cta === 'Falar com vendas' ? '/login' : '/signup'} className='mt-5 inline-block rounded-md bg-slate-900 px-4 py-2 font-semibold text-white'>{cta}</Link></article>)}
          </div>
        </div>
      </section>

      <section className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold tracking-tight'>FAQ</h2>
        <div className='mt-6 space-y-3'>
          {faqs.map((item) => <details key={item.q} className='rounded-lg border border-slate-200 bg-white p-4'><summary className='cursor-pointer font-semibold'>{item.q}</summary><p className='mt-2 text-slate-600'>{item.a}</p></details>)}
        </div>
      </section>

      <section className='bg-slate-900'>
        <div className='mx-auto w-full max-w-6xl px-4 py-16 text-center text-white sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold'>Pronto para lançar sua próxima campanha hoje?</h2>
          <p className='mx-auto mt-3 max-w-2xl text-slate-300'>Ative o onboarding gratuito e publique campanhas com aparência profissional em minutos.</p>
          <Link href='/signup' className='mt-6 inline-block rounded-md bg-white px-6 py-3 font-semibold text-slate-900'>Começar grátis</Link>
        </div>
      </section>

      <footer className='border-t border-slate-200 bg-white'>
        <div className='mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-5 lg:px-8'>
          <div><p className='font-semibold text-slate-900'>Promo SaaS</p><p className='mt-2'>Plataforma de promoções comerciais para equipes de marketing e vendas.</p></div>
          <div><p className='font-semibold text-slate-900'>Produto</p><p className='mt-2'>Recursos</p><p>Preços</p><p>FAQ</p></div>
          <div><p className='font-semibold text-slate-900'>Recursos</p><p className='mt-2'>Cases</p><p>Suporte</p><p>Status</p></div>
          <div><p className='font-semibold text-slate-900'>Empresa</p><p className='mt-2'>Sobre</p><p>Contato</p><p>Parceiros</p></div>
          <div><p className='font-semibold text-slate-900'>Legal</p><p className='mt-2'>Termos</p><p>Privacidade</p><p>LGPD</p></div>
        </div>
      </footer>
    </main>
  );
}
