import { useEffect, useMemo, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function useAuth(){
  const [token, setToken] = useState(localStorage.getItem('token')||'');
  const [email, setEmail] = useState(localStorage.getItem('email')||'');
  const authed = !!token;
  const save = (t,e)=>{ localStorage.setItem('token',t); localStorage.setItem('email',e); setToken(t); setEmail(e); };
  const clear = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('email'); setToken(''); setEmail(''); };
  return { token, email, authed, save, clear };
}

export default function Dashboard(){
  const auth = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email:'', password:'', name:'' });
  const [search, setSearch] = useState({ location:'San Francisco', category:'restaurant', limit:8 });
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [proposal, setProposal] = useState(null);
  const headers = useMemo(()=> auth.token ? { 'Content-Type':'application/json', 'X-Auth-Token': auth.token } : { 'Content-Type':'application/json' }, [auth.token]);

  const call = async (path, body) => {
    const r = await fetch(`${API}${path}`, { method:'POST', headers, body: JSON.stringify(body)});
    if(!r.ok){ throw new Error(await r.text()); }
    return r.json();
  };

  const onAuth = async () => {
    const path = mode==='login' ? '/auth/login' : '/auth/signup';
    const res = await call(path, form);
    auth.save(res.token, res.email);
  };

  const onSearch = async () => {
    const res = await call('/business/search', search);
    setResults(res.results);
  };

  const onAnalyze = async (url) => {
    const res = await call('/analyze', { url });
    setAnalysis(res);
  };

  const onProposal = async (url, name, category) => {
    const res = await call('/proposal', { url, business_name: name, category });
    setProposal(res.structure);
  };

  const onPreview = async () => {
    const res = await call('/proposal/preview', { structure: proposal });
    const blob = new Blob([res.html], { type:'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  if(!auth.authed){
    return (
      <section id="app" className="px-6 py-16 bg-slate-950">
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h2 className="text-white text-2xl font-semibold">{mode==='login' ? 'Login' : 'Create account'}</h2>
          <div className="mt-4 space-y-3">
            {mode==='signup' && (
              <input className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            )}
            <input className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            <input type="password" className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
            <button onClick={onAuth} className="w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white">{mode==='login' ? 'Login' : 'Sign up'}</button>
            <button onClick={()=>setMode(mode==='login'?'signup':'login')} className="w-full px-4 py-2 rounded-lg bg-white/10 text-white">{mode==='login'?'Create account':'Have an account? Login'}</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="app" className="px-6 py-16 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Creator Dashboard</h2>
          <div className="text-sm text-slate-300">{auth.email} <button onClick={auth.clear} className="ml-3 underline">Logout</button></div>
        </div>

        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <input className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800" value={search.location} onChange={e=>setSearch({...search,location:e.target.value})} placeholder="City or ZIP" />
          <select className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800" value={search.category} onChange={e=>setSearch({...search,category:e.target.value})}>
            <option value="restaurant">Restaurants</option>
            <option value="dentist">Dentists</option>
            <option value="salon">Salons</option>
            <option value="cafe">Cafes</option>
            <option value="bar">Bars</option>
            <option value="bakery">Bakeries</option>
          </select>
          <input type="number" min={1} max={20} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800" value={search.limit} onChange={e=>setSearch({...search,limit:Number(e.target.value)})} />
          <button onClick={onSearch} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600">Find businesses</button>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {results.map((b,idx)=> (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="font-semibold">{b.name}</h3>
              <p className="text-sm text-slate-300">{b.address}</p>
              <a href={b.website} target="_blank" className="text-blue-400 text-sm underline break-all">{b.website}</a>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>{ setSelected(b); onAnalyze(b.website); }} className="px-3 py-2 rounded-lg bg-white/10">Analyze</button>
                <button onClick={()=>{ setSelected(b); onProposal(b.website, b.name, b.category); }} className="px-3 py-2 rounded-lg bg-blue-500">Generate proposal</button>
              </div>
            </div>
          ))}
        </div>

        {analysis && (
          <div className="mt-10 p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xl font-semibold">Analysis</h3>
            <div className="mt-2 text-slate-300 text-sm">Score: {analysis.score}/10</div>
            <div className="mt-2 text-slate-300 text-sm">Issues: {analysis.issues.join('; ')}</div>
            <div className="mt-2 text-slate-300 text-sm">Recommendations: {analysis.recommendations.join('; ')}</div>
          </div>
        )}

        {proposal && (
          <div className="mt-10 p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xl font-semibold">Redesign Proposal</h3>
            <pre className="mt-3 whitespace-pre-wrap text-slate-300 text-sm">{JSON.stringify(proposal, null, 2)}</pre>
            <div className="mt-4 flex gap-2">
              <button onClick={onPreview} className="px-4 py-2 rounded-lg bg-blue-500">Open HTML preview</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
