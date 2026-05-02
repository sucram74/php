'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ConsumerCouponsPage(){
  const [data,setData]=useState<any>(null);
  const [error,setError]=useState('');
  useEffect(()=>{const token=new URLSearchParams(window.location.search).get('token'); if(!token){setError('Token não informado.');return;} api(`/public/consumer-coupons?token=${token}`).then(setData).catch(()=>setError('Link inválido ou expirado.'));},[]);
  if(error) return <div className='p-6'><h1 className='text-xl font-bold'>Consulta de cupons</h1><p>{error}</p></div>;
  if(!data) return <div className='p-6'>Carregando...</div>;
  return <div className='space-y-4 p-6'>
    <h1 className='text-2xl font-bold'>Consulta de cupons</h1>
    <div className='ui-card space-y-1'>
      <p><strong>Loja:</strong> {data.campaign.store}</p>
      <p><strong>Campanha:</strong> {data.campaign.title}</p>
      <p><strong>Data final:</strong> {new Date(data.campaign.endDate).toLocaleString('pt-BR')}</p>
      <p><strong>Status:</strong> {data.campaign.active ? 'Ativa' : 'Finalizada'}</p>
      <p><strong>Total de cupons:</strong> {data.totalCoupons}</p>
    </div>
    <div className='ui-card'><h2 className='font-semibold'>Números dos cupons</h2><div className='mt-2 flex flex-wrap gap-2'>{data.coupons.map((c:string)=><span key={c} className='rounded bg-slate-100 px-2 py-1 text-sm'>{c}</span>)}</div></div>
    <div className='ui-card'><h2 className='font-semibold'>Histórico de compras</h2>{data.purchases.map((p:any)=><div key={p.id} className='border-b py-1 text-sm'>Compra de R$ {Number(p.amount).toFixed(2)} em {new Date(p.purchaseDate).toLocaleString('pt-BR')}</div>)}</div>
  </div>
}
