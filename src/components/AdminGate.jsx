import { useEffect, useState } from 'react';

const API = (() => {
  const env = import.meta.env.VITE_BACKEND_URL;
  if (env) return env;
  if (typeof window !== 'undefined') {
    const u = new URL(window.location.href);
    // Modal style host mapping: ...-3000. -> ...-api.
    if (u.hostname.includes('-3000.')) {
      const host = u.hostname.replace('-3000.', '-api.');
      return `${u.protocol}//${host}`;
    }
    // Fallback: switch dev port 3000 -> 8000
    if (u.port === '3000') {
      return `${u.protocol}//${u.hostname}:8000`;
    }
    return `${u.protocol}//${u.hostname}`;
  }
  return 'http://localhost:8000';
})();

export default function AdminGate({ token, children }){
  const [status, setStatus] = useState('loading');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const check = async () => {
    try{
      if(!token){ setStatus('denied'); setReason('Brak tokenu. Zaloguj się.'); return; }
      const r = await fetch(`${API}/auth/me`, { headers: { 'X-Auth-Token': token } });
      if(!r.ok){
        const txt = await r.text().catch(()=> '');
        setReason(txt || `HTTP ${r.status}`);
        setStatus('denied');
        return;
      }
      const me = await r.json();
      if(me.role === 'admin'){
        setStatus('ok');
        setReason('');
      } else {
        setStatus('denied');
        setReason('Użytkownik nie ma roli admin.');
      }
    }catch(e){
      setStatus('denied');
      setReason('Błąd połączenia z API. Sprawdź adres backendu.');
    }
  };

  useEffect(()=>{ check(); },[token]);

  const tryBootstrap = async () => {
    if(!token) return;
    setBusy(true);
    try{
      const r = await fetch(`${API}/auth/bootstrap-admin`, { method:'POST', headers: { 'X-Auth-Token': token } });
      const ok = r.ok;
      const txt = await r.text().catch(()=> '');
      if(!ok){
        setReason(txt || `Bootstrap nieudany (HTTP ${r.status})`);
      } else {
        setReason('');
      }
      await check();
    } finally {
      setBusy(false);
    }
  };

  if(status==='loading') return <div className="mt-6 text-slate-300 text-sm">Sprawdzanie dostępu administratora…</div>;
  if(status==='denied') return (
    <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm space-y-3">
      <div>Access denied. Admin only.{reason ? ` (${reason})` : ''}</div>
      {token && (
        <div className="flex items-center gap-2">
          <button onClick={check} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white">Spróbuj ponownie</button>
          <button onClick={tryBootstrap} disabled={busy} className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50">
            {busy ? 'Przyznawanie…' : 'Utwórz pierwszego admina'}
          </button>
        </div>
      )}
      <p className="text-slate-400">Jeśli widzisz "Admin already exists", zaloguj się na konto z rolą admin lub poproś o nadanie uprawnień.</p>
    </div>
  );
  return children;
}
