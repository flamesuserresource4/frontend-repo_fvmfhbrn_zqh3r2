import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flame-icon.svg" alt="logo" className="h-6 w-6" />
            <span className="font-semibold">Creator Leads</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#app" className="hover:text-white">App</a>
          </nav>
        </div>
      </header>
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <Dashboard />
      </main>
      <footer className="px-6 py-10 text-center text-slate-400">© {new Date().getFullYear()} Creator Leads</footer>
    </div>
  )
}

export default App
