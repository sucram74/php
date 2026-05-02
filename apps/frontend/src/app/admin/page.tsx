'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

const brl = (v:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v||0);
const st = (s:string)=>({pending:'Pendente',pending_review:'Aguardando análise',paid:'Pago',rejected:'Rejeitado'} as any)[s]||s;

export default function AdminPage(){
  const [d,setD]=useState<any>({});
  const [pending,setPending]=useState<any[]>([]);
  const [packs,setPacks]=useState<any[]>([]);
  const [toast,setToast]=useState('');
  const [form,setForm]=useState({name:'',quantity:5,price:49.9});
  const [view,setView]=useState<'campanhas'|'consumidores'|'cupons'|'sorteios'|'cupons_sorteados'|'sem_credito'|''>('');
  const [query,setQuery]=useState('');
  const [lists,setLists]=useState<any>({campaigns:[],consumers:[],coupons:[],draws:[],stores:[]});
  const [bot,setBot]=useState<any>({unanswered:[],topQuestions:[],ratings:[],sessions:[]});

  const load=async()=>{
    const [ca,co,cu,dr,pd,pk]=await Promise.all([api('/campaigns'),api('/consumers'),api('/coupons'),api('/draws'),api('/credits/admin/pending-transactions'),api('/credits/admin/packages')]);
    setD({campaigns:ca.length,consumers:co.length,coupons:cu.length,draws:dr.length,drawn:(dr||[]).reduce((a:any,x:any)=>a+x.quantity,0)});
    setPending(pd as any[]); setPacks(pk as any[]);
    setLists({campaigns:ca,consumers:co,coupons:cu,draws:dr,stores:(pd as any[]).map((x:any)=>x.tenant).filter(Boolean)});
    setBot(await api('/help-chat/admin/insights'));
  };
  useEffect(()=>{void load();},[]);

  return <div className='space-y-4'>
    <Toast message={toast} onClose={()=>setToast('')}/>
    <h1 className='text-2xl font-bold'>Painel Marcus</h1>
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>{[['campanhas','Total de campanhas',d.campaigns??0],['consumidores','Total de consumidores',d.consumers??0],['cupons','Total de cupons',d.coupons??0],['sorteios','Total geral de sorteios',d.draws??0],['cupons_sorteados','Total geral de cupons sorteados',d.drawn??0],['sem_credito','Lojas sem crédito',(pending||[]).filter((x:any)=>x.tenant && x.quantity===0).length]].map(([key,title,value])=><button key={String(title)} className='ui-card text-left' onClick={()=>setView(key as any)}><p>{String(title)}</p><strong className='text-2xl'>{value as any}</strong></button>)}</div>
    <div className='ui-card'>
      <h2 className='font-semibold'>Busca rápida (nome, CPF, loja, campanha)</h2>
      <input className='ui-input mt-2' value={query} onChange={e=>setQuery(e.target.value)} placeholder='Digite para buscar...' />
      {view && <div className='mt-3 text-sm'>
        {(view==='campanhas'?lists.campaigns:view==='consumidores'?lists.consumers:view==='cupons'?lists.coupons:view==='sorteios'?lists.draws:view==='cupons_sorteados'?(lists.draws||[]).flatMap((d:any)=>d.winners||[]):lists.stores)
          .filter((x:any)=>JSON.stringify(x).toLowerCase().includes(query.toLowerCase()))
          .slice(0,80)
          .map((x:any,i:number)=><div key={i} className='border-b py-1'>{x.title||x.name||x.couponCode||x.id||'-'} {x.cpf?`• ${x.cpf}`:''}</div>)}
      </div>}
    </div>

    <div className='ui-card space-y-3'>
      <h2 className='font-semibold'>Pacotes de créditos</h2>
      <div className='grid gap-2 md:grid-cols-4'>
        <input className='ui-input' placeholder='Nome do pacote' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className='ui-input' type='number' min={1} value={form.quantity} onChange={e=>setForm({...form,quantity:Number(e.target.value)})}/>
        <input className='ui-input' type='number' min={0} step='0.01' value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})}/>
        <Button onClick={async()=>{await api('/credits/admin/packages',{method:'POST',body:JSON.stringify(form)});setToast('Pacote criado com sucesso.');setForm({name:'',quantity:5,price:49.9});void load();}}>Criar pacote</Button>
      </div>
      <div className='space-y-2'>{packs.map((p:any)=><div key={p.id} className='flex items-center justify-between border-b pb-2 text-sm'><span>{p.name} • {p.quantity} créditos • {brl(Number(p.price))} • {p.active?'Ativo':'Inativo'}</span><div className='flex gap-2'><Button variant='secondary' onClick={async()=>{await api(`/credits/admin/packages/${p.id}`,{method:'PATCH',body:JSON.stringify({active:!p.active})});setToast('Pacote atualizado.');void load();}}>{p.active?'Desativar':'Ativar'}</Button></div></div>)}</div>
    </div>

    <div className='ui-card space-y-3'>
      <div className='flex items-center justify-between'><h2 className='font-semibold'>Transações pendentes</h2><Button variant='secondary' onClick={()=>void load()}>Atualizar pendentes</Button></div>
      <div className='ui-table-wrap'><div className='min-w-[760px] space-y-2'>{pending.map((t:any)=><div key={t.id} className='grid gap-2 border-b pb-2 text-sm md:grid-cols-6'><span>{t.tenant?.name||'-'}</span><span>{t.packageName||'-'}</span><span>{t.quantity} créditos</span><span>{brl(Number(t.amount))}</span><span>{st(t.status)}</span><span className='flex gap-2'><Button onClick={async()=>{await api(`/credits/transactions/${t.id}/mark-paid`,{method:'PATCH'});setToast('Crédito aprovado com sucesso.');void load();}}>Aprovar</Button><Button variant='danger' onClick={async()=>{await api(`/credits/transactions/${t.id}/reject`,{method:'PATCH'});setToast('Transação rejeitada.');void load();}}>Rejeitar</Button></span></div>)}</div></div>
    </div>

    <details className='ui-card space-y-3'>
      <summary className='cursor-pointer font-semibold'>Insights do bot (colapsável)</summary>
      <p className='text-sm'>Não respondidas: {bot.unanswered?.length || 0}</p>
      <div className='ui-table-wrap'><div className='min-w-[640px] text-sm'>
        {(bot.unanswered||[]).slice(0,10).map((q:any,i:number)=><div key={i} className='border-b py-2'>{q.question}</div>)}
      </div></div>
    </details>
  </div>
}
