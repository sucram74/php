'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function CouponsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [campaignId, setCampaignId] = useState('');
  useEffect(() => { void api('/coupons').then(setItems); }, []);

  return <div className='space-y-4'><h1 className='text-2xl font-bold'>Cupons</h1><div className='ui-card grid gap-3 sm:grid-cols-[1fr_auto] items-end'><label className='space-y-1'><span className='ui-label'>ID da campanha</span><input className='ui-input' value={campaignId} onChange={(e) => setCampaignId(e.target.value)} /></label><Button className='w-full sm:w-auto' onClick={() => api(campaignId ? `/coupons/by-campaign/${campaignId}` : '/coupons').then(setItems)}>Buscar</Button></div><div className='ui-table-wrap max-h-[60vh]'><table className='ui-table'><thead><tr><th className='ui-th'>Código</th></tr></thead><tbody>{items.map((i) => <tr key={i.id}><td className='ui-td'>{i.couponCode}</td></tr>)}</tbody></table></div></div>;
}
