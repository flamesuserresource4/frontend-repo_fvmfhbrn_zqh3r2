import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import AdminGate from './components/AdminGate';
import Topbar from './components/Topbar';
import { useMemo, useState } from 'react';

function useAuth(){
  const [token, setToken] = useState(localStorage.getItem('token')||'');
  const [email, setEmail] = useState(localStorage.getItem('email')||'');
  const authed = !!token;
  const save = (t,e)=>{ localStorage.setItem('token',t); localStorage.setItem('email',e); setToken(t); setEmail(e); };
  const clear = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('email'); setToken(''); setEmail(''); };
  return { token, email, authed, save, clear };
}

function App() {
  const auth = useAuth();
  const onNav = (id)=>{ const el = document.getElementById(id); if(el) el.scrollIntoView({ behavior:'smooth'}); };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Topbar onNav={onNav} authed={auth.authed} email={auth.email} onLogout={auth.clear} />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <Dashboard />
        <section id="admin" className="px-6 py-16 bg-slate-950 text-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold">Admin</h2>
            <AdminGate token={auth.token}>
              <AdminPanel token={auth.token} />
            </AdminGate>
          </div>
        </section>
      </main>
      <footer className="px-6 py-10 text-center text-slate-400">© {new Date().getFullYear()} Creator Leads</footer>
    </div>
  )
}

export default App
