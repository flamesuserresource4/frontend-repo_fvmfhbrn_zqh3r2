import { useEffect, useMemo, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function AdminPanel({ token }){
  const headers = useMemo(()=> ({ 'Content-Type':'application/json', 'X-Auth-Token': token }), [token]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchStats = async ()=>{
    try{
      const r = await fetch(`${API}/admin/stats`, { headers });
      if(!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setStats(data);
    }catch(e){ setError(e.message); }
  }

  const fetchUsers = async ()=>{
    try{
      const r = await fetch(`${API}/admin/users`, { headers });
      if(!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setUsers(data.users || []);
    }catch(e){ setError(e.message); }
  }

  useEffect(()=>{ (async()=>{ setLoading(true); await Promise.all([fetchStats(), fetchUsers()]); setLoading(false); })(); },[]);

  const updatePlan = async (email, plan)=>{
    try{
      const r = await fetch(`${API}/admin/users/plan`, { method:'POST', headers, body: JSON.stringify({ email, plan })});
      if(!r.ok) throw new Error(await r.text());
      await fetchUsers();
    }catch(e){ setError(e.message); }
  }

  const updateRole = async (email, role)=>{
    try{
      const r = await fetch(`${API}/admin/users/role`, { method:'POST', headers, body: JSON.stringify({ email, role })});
      if(!r.ok) throw new Error(await r.text());
      await fetchUsers();
    }catch(e){ setError(e.message); }
  }

  if(loading){
    return <div className="mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800">Loading admin data…</div>;
  }

  return (
    <div className="mt-8">
      {error && (<div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm">{error}</div>)}

      {stats && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-sm">Total users</div>
            <div className="text-2xl font-semibold">{stats.users ?? '-'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-sm">Analyses</div>
            <div className="text-2xl font-semibold">{stats.analyses ?? '-'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-sm">Proposals</div>
            <div className="text-2xl font-semibold">{stats.proposals ?? '-'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-sm">Status</div>
            <div className="text-2xl font-semibold">OK</div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Users</h3>
          <button onClick={fetchUsers} className="px-3 py-2 rounded-lg bg-white/10">Refresh</button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Plan</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u, idx)=> (
                <tr key={idx}>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.name || '-'}</td>
                  <td className="py-2 pr-4">
                    <select className="bg-slate-800 border border-slate-700 rounded px-2 py-1" value={u.role || 'user'} onChange={e=>updateRole(u.email, e.target.value)}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <select className="bg-slate-800 border border-slate-700 rounded px-2 py-1" value={u.plan || 'free'} onChange={e=>updatePlan(u.email, e.target.value)}>
                      <option value="free">free</option>
                      <option value="pro">pro</option>
                      <option value="agency">agency</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <button onClick={()=>updateRole(u.email, u.role==='admin'?'user':'admin')} className="px-2 py-1 rounded bg-blue-500">Toggle admin</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
