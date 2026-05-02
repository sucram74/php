'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';

const steps = [
  { path: '/dashboard', title: 'Bem-vindo ao Promo SaaS', text: 'Este painel mostra os principais números da sua loja: campanhas, consumidores, compras e cupons.' },
  { path: '/campaigns', title: 'Campanhas', text: 'Comece criando uma campanha promocional para sua loja.' },
  { path: '/consumers', title: 'Consumidores', text: 'Aqui você cadastra ou consulta consumidores pelo CPF.' },
  { path: '/purchases', title: 'Compras', text: 'Aqui você lança as compras dos clientes e o sistema gera os cupons automaticamente.' },
  { path: '/draws', title: 'Sorteios', text: 'Quando a campanha terminar, use esta área para sortear um ou mais cupons vencedores.' },
];
export function Tutorial(){const [open,setOpen]=useState(false); const [i,setI]=useState(0); const pathname=usePathname(); const router=useRouter();
useEffect(()=>{if(pathname==='/login')return; if(!localStorage.getItem('tutorial_done')) setOpen(true);},[pathname]);
if(!open) return null; const s=steps[i];
return <div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center'><div className='ui-card max-w-xl'><h3 className='text-lg font-bold'>{s.title}</h3><p className='mt-2 text-sm'>{s.text}</p><div className='mt-4 flex gap-2'><Button variant='secondary' onClick={()=>setI(Math.max(0,i-1))}>Voltar</Button><Button onClick={()=>{if(pathname!==s.path) router.push(s.path); if(i<steps.length-1) setI(i+1); else {localStorage.setItem('tutorial_done','1'); setOpen(false);}}}>{i===steps.length-1?'Finalizar':'Próximo'}</Button><Button variant='danger' onClick={()=>{localStorage.setItem('tutorial_done','1');setOpen(false);}}>Pular tutorial</Button></div></div></div>}
