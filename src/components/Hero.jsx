import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Find, Analyze, and Redesign Local Business Websites</h1>
          <p className="mt-4 text-lg text-blue-100">A creator-focused toolkit to discover outdated sites, auto-generate modern redesigns, and send proposals that convert.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#app" className="px-5 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition">Start free</a>
            <a href="#pricing" className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition">See pricing</a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
    </section>
  );
}
