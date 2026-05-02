'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from './ui/button';

export function HelpBot({ mode = 'floating' }: { mode?: 'floating' | 'sidebar' }) {
  const [open, setOpen] = useState(mode === 'sidebar');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [log, setLog] = useState<{ q: string; a: string }[]>([{ q: '', a: 'Olá! 😊 Sou a assistente do Promo SaaS.' }]);

  const panel = (
    <div className='w-full rounded-md border border-slate-200 bg-white p-3 text-slate-900 shadow-xl md:w-80'>
      <div className='flex items-center justify-between'><h3 className='font-semibold'>Ajuda Promo SaaS</h3>{mode === 'floating' && <button className='text-xs' onClick={() => setOpen(false)}>Minimizar</button>}</div>
      <div className='my-2 max-h-52 overflow-auto text-sm'>{log.map((x, i) => <div key={i} className='mb-2'><p><strong>Você:</strong> {x.q}</p><p><strong>Bot:</strong> {x.a}</p></div>)}</div>
      <input className='ui-input' value={msg} onChange={(e) => setMsg(e.target.value)} placeholder='Digite sua dúvida...' />
      <div className='mt-2 flex gap-2'>
        <Button onClick={async () => { if (!msg.trim()) return; const q = msg; setMsg(''); setLoading(true); const r: any = await api('/help-chat/ask', { method: 'POST', body: JSON.stringify({ message: q, sessionId }) }); setSessionId(r.sessionId); setLog((prev) => [...prev, { q, a: r.reply }]); setLoading(false); }}>{loading ? 'Respondendo...' : 'Enviar'}</Button>
      </div>
    </div>
  );

  if (mode === 'sidebar') {
    return <div className='mt-4'>{panel}</div>;
  }

  return <div className='fixed bottom-5 right-5 z-30 max-w-[92vw]'><button aria-label='Abrir ajuda' className='ml-auto block h-11 w-11 rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-md transition hover:shadow-lg' onClick={() => setOpen(!open)}>💬</button>{open && <div className='mt-2'>{panel}</div>}</div>;
}
