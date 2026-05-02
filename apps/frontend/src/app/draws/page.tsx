'use client';
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';
const mCpf = (cpf: string) => cpf.replace(/(\d{3})\d{6}(\d{2})/, '$1.XXX.XXX-$2');
const mPhone = (p: string) => { const d = p.replace(/\D/g, ''); return `${d.slice(0, 2)} ${d.slice(2, 7)}-XX${d.slice(-2)}`; };
const mName = (n: string) => n.split(' ').slice(0, 2).map((p, i) => (i ? `${p[0]}.` : p)).join(' ');
const sanitize = (p: string) => { let d = p.replace(/\D/g, ''); if (d.startsWith('55')) d = d.slice(2); return d; };

export default function DrawsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]); const [sel, setSel] = useState(''); const [q, setQ] = useState(1); const [av, setAv] = useState(0); const [r, setR] = useState<any>(null); const [store, setStore] = useState('Loja'); const [toast, setToast] = useState(''); const [loading, setLoading] = useState(false);
  useEffect(() => { void api('/campaigns').then(setCampaigns); const t = localStorage.getItem('token'); if (t) setStore(JSON.parse(atob(t.split('.')[1])).tenantName || 'Loja'); }, []);
  useEffect(() => { if (!sel) return; void api(`/coupons/by-campaign/${sel}`).then((x: any[]) => setAv(x.filter((c) => c.active).length)); }, [sel]);

  return <div className='space-y-4'><Toast message={toast} onClose={() => setToast('')} /><h1 className='text-2xl font-bold'>Sorteios</h1><div className='ui-card grid gap-3 md:grid-cols-2'><select className='ui-input' value={sel} onChange={(e) => setSel(e.target.value)}><option value=''>Selecione campanha</option>{campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select><input className='ui-input' type='number' min={1} value={q} onChange={(e) => setQ(Number(e.target.value))} /><p className='text-sm md:col-span-2'>Total de cupons disponíveis: {av}</p><Button className='w-full sm:w-auto' disabled={loading} onClick={async () => { setLoading(true); setToast(''); try { setR(await api('/draws', { method: 'POST', body: JSON.stringify({ campaignId: sel, quantity: q }) })); setToast('Sorteio realizado com sucesso.'); } catch (e) { setToast(e instanceof ApiError ? e.message : 'Erro ao realizar sorteio.'); } finally { setLoading(false); } }}>{loading ? 'Realizando...' : 'Realizar sorteio'}</Button></div>{r && <div className='ui-card'><h2 className='font-semibold'>Resultado</h2><div className='ui-table-wrap mt-2'><div className='min-w-[760px] space-y-2'>{r.winners.map((w: any) => <div key={w.id} className='grid grid-cols-6 items-center gap-2 border-t py-2 text-sm'><span>#{w.position}</span><span>{w.coupon.couponCode}</span><span>{mName(w.consumer.name)}</span><span>{mCpf(w.consumer.cpf)}</span><span>{mPhone(w.consumer.phone)}</span><Button onClick={() => { const phone = sanitize(w.consumer.phone); if (!phone) { setToast('Consumidor sem telefone cadastrado.'); return; } const full = phone.startsWith('55') ? phone : `55${phone}`; const msg = encodeURIComponent(`Olá, ${w.consumer.name}! Parabéns! Você foi sorteado na campanha ${r.campaign.title} da loja ${store}. Cupom sorteado: ${w.coupon.couponCode}. Entre em contato para retirada do prêmio.`); window.open(`https://wa.me/${full}?text=${msg}`, '_blank'); }}>Avisar cliente</Button></div>)}</div></div></div>}</div>;
}
