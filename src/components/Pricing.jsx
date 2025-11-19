export default function Pricing(){
  const tiers = [
    {name:'Free', price:'$0', note:'Trial', features:['5 searches/mo','2 proposals/mo','Basic analysis']},
    {name:'Pro', price:'$29', note:'/mo', features:['50 searches/mo','20 proposals/mo','Export HTML','Email templates']},
    {name:'Agency', price:'$79', note:'/mo', features:['Unlimited searches','Unlimited proposals','Team seats','Priority support']},
  ];
  return (
    <section id="pricing" className="px-6 py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Pricing</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {tiers.map(t => (
            <div key={t.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-white font-semibold">{t.name}</h3>
              <div className="mt-2 text-3xl font-bold text-white">{t.price}<span className="text-slate-400 text-base font-normal">{t.note}</span></div>
              <ul className="mt-4 space-y-2 text-slate-300 text-sm">
                {t.features.map(f => (<li key={f}>• {f}</li>))}
              </ul>
              <a href="#app" className="mt-6 inline-block px-5 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium">Get started</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
