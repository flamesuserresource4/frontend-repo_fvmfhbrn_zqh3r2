import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function AdminGate({ token, children }){
  const [status, setStatus] = useState('loading');

  useEffect(()=>{
    (async()=>{
      try{
        const r = await fetch(`${API}/auth/me`, { headers: { 'X-Auth-Token': token } });
        if(!r.ok){ setStatus('denied'); return; }
        const me = await r.json();
        setStatus(me.role === 'admin' ? 'ok' : 'denied');
      }catch{
        setStatus('denied');
      }
    })();
  },[token]);

  if(status==='loading') return <div className="mt-6 text-slate-300 text-sm">Checking admin access…</div>;
  if(status==='denied') return <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm">Access denied. Admin only.</div>;
  return children;
}
