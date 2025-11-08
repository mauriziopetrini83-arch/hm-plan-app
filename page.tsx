'use client';
import { useMemo, useState, useEffect } from 'react';

const WEEKS = [
  { w: 1, run1: "8×1 km 11.5 km/h (5:13/km), rec 500 m 10.5 km/h (5:43/km)", run2: "10 km 11.0 km/h (5:27/km) + 6×100 m 12.8–13.0 km/h (4:41–4:37/km)", long: "12 km 10.6–10.8 km/h (5:40–5:33/km) → 6 km 10.9 km/h (5:30/km)", note: "Risc. 2 km 10.6 km/h • Def. 2 km 10.6 km/h • Recuperi 10.5" },
  { w: 2, run1: "3×3 km 11.2–11.3 km/h (5:21–5:19/km), rec 1 km 10.5 km/h (5:43/km)", run2: "12×400 m 12.5 km/h (4:48/km), rec 400 m 10.5 km/h (5:43/km)", long: "14 km 10.6–10.8 km/h (5:40–5:33/km) → 2×3 km 10.9 km/h (5:30/km), rec 1 km 10.5 km/h", note: "Risc./def. come indicato" },
  { w: 3, run1: "5×2 km 11.5 km/h (5:13/km), rec 1 km 10.5 km/h (5:43/km)", run2: "11–12 km progressivo 10.7→11.0 km/h (5:36→5:27/km)", long: "15 km 10.6–10.8 km/h (5:40–5:33/km) → 5 km 10.9 km/h (5:30/km) → 2 km 10.6 km/h (5:40/km)", note: "Risc./def. come indicato" },
  { w: 4, run1: "5 km 10.9 km/h (5:30/km) continuo", run2: "8×1 km 11.0 km/h (5:27/km), rec 500 m 10.5 km/h (5:43/km)", long: "16–18 km 10.6–10.8 km/h (5:40–5:33/km)", note: "Scarico" },
  { w: 5, run1: "4×3 km 11.2–11.3 km/h (5:21–5:19/km), rec 1 km 10.5 km/h (5:43/km)", run2: "10×600 m 12.5 km/h (4:48/km), rec 400 m 10.5 km/h (5:43/km)", long: "12 km 10.6–10.8 km/h → 2×4 km 10.9 km/h (5:30/km), rec 1 km 10.5 km/h", note: "" },
  { w: 6, run1: "6×1.5 km 11.5 km/h (5:13/km), rec 800 m 10.5 km/h (5:43/km)", run2: "12 km 11.0 km/h (5:27/km) + 8×100 m 12.8–13.0 km/h", long: "16 km 10.6–10.8 km/h → 4 km 11.0 km/h (5:27/km)", note: "" },
  { w: 7, run1: "3×4 km 11.2–11.3 km/h (5:21–5:19/km), rec 1 km 10.5 km/h (5:43/km)", run2: "8×800 m 12.5–12.8 km/h (4:48–4:41/km), rec 400 m 10.5 km/h (5:43/km)", long: "10 km 10.6–10.8 km/h → 8 km 10.9 km/h (5:30/km) → 2 km 10.6 km/h", note: "" },
  { w: 8, run1: "6 km 11.5 km/h (5:13/km) (test interno 20’ inclusi)", run2: "10 km 11.0 km/h (5:27/km) + 6×100 m 12.8–13.0 km/h", long: "18 km 10.6–10.8 km/h (5:40–5:33/km)", note: "Scarico + verifica" },
  { w: 9, run1: "5×2 km 11.5 km/h (5:13/km), rec 1 km 10.5 km/h (5:43/km)", run2: "12–13 km 10.9 km/h (5:30/km) continuo", long: "14 km 10.6–10.8 km/h → 6 km 10.9 km/h → 2 km 10.6 km/h", note: "" },
  { w: 10, run1: "2×5 km 11.2–11.3 km/h (5:21–5:19/km), rec 1.5 km 10.5 km/h (5:43/km)", run2: "10×400 m 12.8 km/h (4:41/km), rec 400 m 10.5 km/h", long: "12 km 10.6–10.8 km/h → 2×5 km 10.9 km/h (5:30/km), rec 1 km 10.5 km/h", note: "" },
  { w: 11, run1: "3 km 11.2–11.3 + 3 km 11.5 + 3 km 11.2–11.3, rec 1 km 10.5 tra i blocchi", run2: "8–10 km 11.0 km/h (5:27/km) + 10×100 m 12.8–13.0", long: "10 km 10.6–10.8 → 10 km 10.9 (5:30/km)", note: "" },
  { w: 12, run1: "3×2 km 10.9 km/h (5:30/km), rec 1 km 10.5 km/h (5:43/km)", run2: "6 km 11.0 km/h (5:27/km) + 6×100 m 12.8–13.0", long: "Gara: 3–4 km 10.7 → 16–17 km 10.9; ultimi 3 km se ok 11.1–11.2", note: "Taper" },
];

function useLocalProgress(key='hm-progress') {
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(progress)); }, [progress]);
  return [progress, setProgress];
}

function WeekCard({ w, prog, setProg }) {
  const id = (s) => `w${w.w}-${s}`;
  const items = [
    { k: id('r1'), label: 'Corsa 1', txt: w.run1 },
    { k: id('r2'), label: 'Corsa 2', txt: w.run2 },
    { k: id('lon'), label: 'Lungo', txt: w.long },
  ];
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Settimana {w.w}</h3>
        <span className="text-xs text-gray-500">{w.note}</span>
      </div>
      <div className="space-y-2">
        {items.map((it) => (
          <label key={it.k} className="flex gap-2 items-start cursor-pointer">
            <input
              type="checkbox"
              checked={!!prog[it.k]}
              onChange={(e) => setProg((p) => ({ ...p, [it.k]: e.target.checked }))}
              className="mt-1 h-4 w-4"
            />
            <div>
              <div className="text-sm font-medium">{it.label}</div>
              <div className="text-sm text-gray-700 leading-relaxed">{it.txt}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const [q, setQ] = useState('');
  const [progress, setProgress] = useLocalProgress();

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return WEEKS.filter(w => !s || `${w.w} ${w.run1} ${w.run2} ${w.long} ${w.note}`.toLowerCase().includes(s));
  }, [q]);

  const printPage = () => window.print();
  const reset = () => setProgress({});

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Piano Mezza Maratona — Vista Atleta</h1>
          <p className="text-sm text-gray-600">3 allenamenti corsa + 1/2 forza • velocità precise</p>
        </div>
        <div className="flex gap-2">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cerca (es. 11.5 km/h, 400 m, settimana 5)" className="border rounded px-3 py-2 text-sm w-72" />
          <button onClick={printPage} className="border rounded px-3 py-2 text-sm">Stampa</button>
          <button onClick={reset} className="border rounded px-3 py-2 text-sm">Azzera spunte</button>
        </div>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((w) => (
          <WeekCard key={w.w} w={w} prog={progress} setProg={setProgress} />
        ))}
      </section>

      <footer className="text-xs text-gray-500">
        Consiglio: pubblica su Vercel, poi incorpora su WordPress con un iframe alla URL pubblica.
      </footer>

      <style jsx global>{`
        @media print {
          .max-w-6xl { max-width: none; }
          .p-4, .p-8 { padding: 0; }
          .grid { gap: 8px; }
        }
      `}</style>
    </main>
  );
}
