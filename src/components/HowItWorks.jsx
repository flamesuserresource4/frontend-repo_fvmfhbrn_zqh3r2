export default function HowItWorks() {
  const steps = [
    { n: 1, t: 'Search local businesses', d: 'Find websites near you by category and location.' },
    { n: 2, t: 'Analyze their site', d: 'We crawl the page and score clarity, SEO, and UX.' },
    { n: 3, t: 'Generate redesign', d: 'Get a ready-made structure and content draft.' },
    { n: 4, t: 'Send proposal', d: 'Export or email a polished proposal in minutes.' },
  ];
  return (
    <section className="px-6 py-20 bg-slate-950" id="how">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white">How it works</h2>
        <div className="mt-10 grid md:grid-cols-4 gap-6">
          {steps.map(s => (
            <div key={s.n} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">{s.n}</div>
              <h3 className="mt-4 text-white font-semibold">{s.t}</h3>
              <p className="text-slate-300 text-sm mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
