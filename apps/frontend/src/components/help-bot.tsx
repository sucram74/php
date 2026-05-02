'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from './ui/button';

export function HelpBot({ isAuthenticated = false }: { isAuthenticated?: boolean }){
  const [open,setOpen]=useState(false); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false); const [sessionId,setSessionId]=useState<string|undefined>(); const [log,setLog]=useState<{q:string;a:string}[]>([{q:'',a:'Olá! 😊 Sou a assistente do Promo SaaS. Posso ajudar com campanhas, compras, créditos, cupons e sorteios.'}]);
  const positionClass = isAuthenticated ? 'bottom-20 left-4 md:bottom-6 md:left-[17rem]' : 'bottom-4 right-4';

  return <div className={`fixed ${positionClass} z-50`}>
    <button className='h-14 w-14 rounded-full bg-pink-500 text-2xl text-white shadow-lg' onClick={()=>setOpen(!open)}>👩</button>
    {open && <div className='mt-2 w-80 rounded-md border bg-white p-3 shadow-xl'>
      <div className='flex items-center justify-between'><h3 className='font-semibold'>Ajuda Promo SaaS</h3><div className='space-x-2'><button className='text-xs' onClick={()=>setLog([{q:'',a:'Olá! 😊 Sou a assistente do Promo SaaS. Posso ajudar com campanhas, compras, créditos, cupons e sorteios.'}])}>Limpar</button><button className='text-xs' onClick={()=>setOpen(false)}>Minimizar</button></div></div>
      <div className='my-2 max-h-52 overflow-auto text-sm'>{log.map((x,i)=><div key={i} className='mb-2'><p><strong>Você:</strong> {x.q}</p><p><strong>Bot:</strong> {x.a}</p></div>)}</div>
      <input className='ui-input' value={msg} onChange={e=>setMsg(e.target.value)} placeholder='Digite sua dúvida...' />
      <div className='mt-2 flex gap-2'><Button onClick={async()=>{if(!msg.trim())return; const q=msg; setMsg(''); setLoading(true); const r:any=await api('/help-chat/ask',{method:'POST',body:JSON.stringify({message:q,sessionId})}); setSessionId(r.sessionId); setLog([...log,{q,a:r.reply}]); setLoading(false);}}>{loading?'Respondendo...':'Enviar'}</Button></div>
      <div className='mt-3 text-sm'>Avalie nossa ajuda: {[1,2,3,4,5].map((s)=><button key={s} onClick={async()=>{await api('/help-chat/rate',{method:'POST',body:JSON.stringify({stars:s,sessionId})});}} className='mr-1'>⭐</button>)}</div>
    </div>}
  </div>
}
