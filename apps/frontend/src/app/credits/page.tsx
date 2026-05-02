'use client';
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

const formatBRL = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number.isFinite(value) ? value : 0);

export default function(){
  const[b,setB]=useState(0);const[p,setP]=useState<any[]>([]);const[tx,setTx]=useState<any>(null);const[store,setStore]=useState('Loja');
  const[toast,setToast]=useState('');const[open,setOpen]=useState(false);const[selectedPackage,setSelectedPackage]=useState('');const[history,setHistory]=useState<any[]>([]);const[loading,setLoading]=useState(false);
  const load = async()=>{const [bal, packs, hist] = await Promise.all([api('/credits/balance'), api('/credits/packages'), api('/credits/transactions')]); setB((bal as any).balance); setP(packs as any[]); setHistory(hist as any[]);};
  useEffect(()=>{void load(); const t=localStorage.getItem('token'); if(t) setStore(JSON.parse(atob(t.split('.')[1])).tenantName||'Loja');},[]);
  return <div className='space-y-4'><Toast message={toast}/><h1 className='text-2xl font-bold'>Créditos</h1><div className='ui-card flex items-center justify-between'><span>Saldo atual: <strong>{b}</strong></span><Button onClick={()=>setOpen(true)}>Adicionar créditos</Button></div>
  {open && <div className='fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4'><div className='ui-card w-full max-w-xl space-y-3'><h2 className='text-lg font-semibold'>Comprar créditos</h2><select className='ui-input' value={selectedPackage} onChange={e=>setSelectedPackage(e.target.value)}><option value=''>Selecione um pacote</option>{p.map(x=><option key={x.id} value={x.id}>{x.name} — {x.quantity} créditos — {formatBRL(Number(x.price))}</option>)}</select><div className='flex gap-2'><Button variant='secondary' onClick={()=>setOpen(false)}>Cancelar</Button><Button disabled={loading||!selectedPackage} onClick={async()=>{setLoading(true);try{const created=await api('/credits/purchase',{method:'POST',body:JSON.stringify({packageId:selectedPackage})});setTx(created);setToast('Compra iniciada com sucesso.');setOpen(false);setSelectedPackage('');void load();}catch(e){setToast(e instanceof ApiError?e.message:'Erro ao comprar créditos.');}finally{setLoading(false);}}}>{loading?'Processando...':'Confirmar'}</Button></div></div></div>}
  {tx&&<div className='ui-card space-y-2'><p>Chave Pix: {tx.pixKey}</p><p>Pix copia e cola: {tx.pixCopyPaste}</p><Button onClick={async()=>{try{await api(`/credits/transactions/${tx.id}/inform`,{method:'PATCH'});setToast('Pagamento informado. Aguarde confirmação.');void load();}catch(e){setToast(e instanceof ApiError?e.message:'Erro ao informar pagamento.');}}}>Já paguei</Button><Button onClick={()=>{const msg=encodeURIComponent(`Olá, sou da loja ${store}. Realizei o pagamento do pacote ${tx.packageName}, no valor de ${formatBRL(Number(tx.amount))}, mas meus créditos ainda não foram liberados. Pode verificar, por favor?`); window.open(`https://wa.me/5500000000000?text=${msg}`,'_blank')}}>Chamar suporte</Button></div>}
  <div className='ui-card'><h2 className='font-semibold mb-2'>Histórico de movimentação</h2><div className='space-y-2'>{history.map((h:any)=><div key={h.id} className='flex justify-between border-b pb-2 text-sm'><span>{h.type} • {h.status}</span><span>{h.quantity} crédito(s) • {formatBRL(Number(h.amount))}</span></div>)}</div></div>
  </div>
}
