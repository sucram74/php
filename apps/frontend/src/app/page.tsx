import Image from 'next/image';
import Link from 'next/link';

const trustLogos = ['Aurora Retail', 'Nova Moda', 'Casa Prime', 'TrendLab', 'Viva Store'];

const benefits = [
  { title: 'Mais vendas em campanhas sazonais', text: 'Ative mecânicas promocionais com urgência e aumente a conversão sem depender de operação manual.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80', alt: 'Interior de loja de roupas premium com araras e iluminação moderna' },
  { title: 'Leads qualificados para remarketing', text: 'Capture dados com consentimento e organize participantes para novas ações comerciais.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', alt: 'Vitrine com calçados esportivos em destaque para promoção' },
  { title: 'Gestão centralizada e segura', text: 'Controle regras, cupons, compras e sorteios auditáveis em um único painel.', image: 'https://images.unsplash.com/photo-1607082350920-7de5b7ac2f42?auto=format&fit=crop&w=900&q=80', alt: 'Consumidora concluindo compra em loja física durante campanha' },
  { title: 'Decisões baseadas em resultado', text: 'Acompanhe desempenho de campanhas em tempo real com métricas de participação e retorno.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80', alt: 'Comerciante analisando métricas em notebook no balcão da loja' },
];

const howItWorks = [
  { text: 'Crie a campanha com objetivo, período e regras.', image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80', alt: 'Time de varejo planejando campanha promocional em quadro' },
  { text: 'Personalize mecânica de participação e critérios promocionais.', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&q=80', alt: 'Pessoa configurando regras promocionais no sistema' },
  { text: 'Publique e divulgue em canais como WhatsApp, Instagram e loja física.', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80', alt: 'Cliente recebendo oferta promocional no smartphone dentro da loja' },
  { text: 'Monitore resultados e otimize as próximas campanhas com dados reais.', image: 'https://images.unsplash.com/photo-1551281044-8b6c85c42e3a?auto=format&fit=crop&w=900&q=80', alt: 'Dashboard com gráficos de vendas e conversão em tempo real' },
];

const useCases = [
  { segment: 'Moda', text: 'Promoções relâmpago para novas coleções e liquidação de estoque.', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80' },
  { segment: 'Calçados', text: 'Campanhas de ticket médio com combos e cupons por categoria.', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80' },
  { segment: 'Supermercado', text: 'Ações semanais para recorrência e retenção de compradores.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80' },
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
      <section className='mx-auto grid w-full max-w-6xl gap-10 px-4 pb-24 pt-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pt-16'>
        <div className='space-y-6'>
          <span className='inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700'>SaaS de promoções e sorteios para varejo</span>
          <h1 className='text-4xl font-bold leading-tight tracking-tight sm:text-5xl'>Crie campanhas promocionais que vendem mais — em minutos.</h1>
          <p className='max-w-xl text-lg text-slate-600'>Lance sorteios, cupons e promoções com painel completo, automação e rastreio de performance para crescer com previsibilidade.</p>
          <div className='flex flex-wrap gap-3'>
            <Link href='/signup' className='rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700'>Começar grátis</Link>
            <a href='#mockups' className='rounded-md border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400'>Ver demo em 2 min</a>
          </div>
        </div>
        <div className='relative'>
          <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl'>
            <Image src='https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1400&q=80' alt='Loja moderna com cliente em atendimento e ambiente premium' width={1400} height={900} className='h-auto w-full object-cover' priority />
          </div>
          <div className='absolute -bottom-8 left-4 right-4 rounded-xl border border-slate-700/40 bg-slate-900/95 p-4 text-slate-100 shadow-2xl'>
            <p className='text-sm text-slate-300'>Dashboard de campanhas</p>
            <div className='mt-4 grid gap-3 sm:grid-cols-3'>
              <div className='rounded-lg bg-slate-800 p-3'><p className='text-xs text-slate-300'>Campanhas ativas</p><p className='text-2xl font-bold'>12</p></div>
              <div className='rounded-lg bg-slate-800 p-3'><p className='text-xs text-slate-300'>Leads gerados</p><p className='text-2xl font-bold'>8.4k</p></div>
              <div className='rounded-lg bg-slate-800 p-3'><p className='text-xs text-slate-300'>Conversão média</p><p className='text-2xl font-bold'>18.7%</p></div>
            </div>
          </div>
        </div>
      </section>
      <section className='border-y border-slate-200 bg-white'><div className='mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8'><p className='text-sm font-medium text-slate-500'>Confiado por marcas que aceleram vendas</p><div className='grid gap-3 sm:grid-cols-5'>{trustLogos.map((logo) => <div key={logo} className='rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-600'>{logo}</div>)}</div></div></section>

      <section className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold tracking-tight'>Benefícios para seu time de marketing</h2>
        <div className='mt-8 grid gap-4 md:grid-cols-2'>{benefits.map((item) => <article key={item.title} className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'><Image src={item.image} alt={item.alt} width={900} height={600} className='h-44 w-full object-cover' /><div className='p-6'><h3 className='text-lg font-semibold'>{item.title}</h3><p className='mt-2 text-slate-600'>{item.text}</p></div></article>)}</div>
      </section>

      <section className='bg-white'><div className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8'><h2 className='text-3xl font-bold tracking-tight'>Como funciona</h2><ol className='mt-8 grid gap-4 md:grid-cols-2'>{howItWorks.map((step, idx) => <li key={step.text} className='overflow-hidden rounded-xl border border-slate-200'><Image src={step.image} alt={step.alt} width={900} height={560} className='h-40 w-full object-cover' /><div className='p-5'><span className='text-sm font-semibold text-indigo-700'>Passo {idx + 1}</span><p className='mt-2 text-slate-700'>{step.text}</p></div></li>)}</ol></div></section>

      <section id='mockups' className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold tracking-tight'>Casos de uso por segmento</h2>
        <div className='mt-8 grid gap-4 lg:grid-cols-3'>{useCases.map((item) => <article key={item.segment} className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'><Image src={item.image} alt={`Equipe de ${item.segment.toLowerCase()} em operação de vendas`} width={900} height={560} className='h-44 w-full object-cover' /><div className='p-5'><p className='font-semibold'>{item.segment}</p><p className='mt-2 text-slate-600'>{item.text}</p></div></article>)}</div>
      </section>

      <section className='bg-white'><div className='mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8'><h2 className='text-3xl font-bold tracking-tight'>Prova social</h2><div className='mt-6 grid gap-6 lg:grid-cols-[1.2fr,1fr]'><div className='overflow-hidden rounded-2xl border border-slate-200 shadow-sm'><Image src='https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80' alt='Empresários e equipe analisando métricas de vendas em reunião' width={1400} height={900} className='h-full w-full object-cover' /></div><div className='rounded-2xl border border-slate-200 bg-slate-50 p-6'><p className='text-2xl font-bold'>+38% de crescimento em campanhas sazonais</p><p className='mt-3 text-slate-600'>“Em duas semanas, conseguimos lançar ações por loja e acompanhar as métricas por canal com muito mais velocidade.”</p></div></div></div></section>

      <section className='relative overflow-hidden bg-slate-900'>
        <Image src='https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1600&q=80' alt='Textura suave premium para seção final de chamada para ação' fill className='object-cover opacity-25' sizes='100vw' />
        <div className='relative mx-auto w-full max-w-6xl px-4 py-16 text-center text-white sm:px-6 lg:px-8'><h2 className='text-3xl font-bold'>Pronto para lançar sua próxima campanha hoje?</h2><p className='mx-auto mt-3 max-w-2xl text-slate-300'>Ative o onboarding gratuito e publique campanhas com aparência profissional em minutos.</p><Link href='/signup' className='mt-6 inline-block rounded-md bg-white px-6 py-3 font-semibold text-slate-900'>Começar grátis</Link></div>
      </section>
    </main>
  );
}
