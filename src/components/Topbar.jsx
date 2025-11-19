export default function Topbar({ onNav, authed, email, onLogout }){
  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-slate-950/50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/flame-icon.svg" alt="logo" className="h-6 w-6" />
          <span className="font-semibold">Creator Leads</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <button onClick={()=>onNav('how')} className="hover:text-white">How it works</button>
          <button onClick={()=>onNav('pricing')} className="hover:text-white">Pricing</button>
          <button onClick={()=>onNav('app')} className="hover:text-white">App</button>
          {authed && (
            <>
              <button onClick={()=>onNav('admin')} className="hover:text-white">Admin</button>
              <span className="ml-2 text-slate-400">{email}</span>
              <button onClick={onLogout} className="underline">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
