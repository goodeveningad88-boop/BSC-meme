'use client';

import TrendingTable from '@/components/TrendingTable';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-10 border-b border-[var(--border)] bg-[#0e1216]">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-tight text-white uppercase italic">
          BSC <span className="text-[var(--accent)]">中文Meme</span> 看板
        </h1>
        <p className="text-center text-[var(--text-secondary)] mt-2 text-sm font-data">
          REAL-TIME DATA • BSC ECOSYSTEM • TRENDING NOW
        </p>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-[var(--border)] bg-black/20 font-data">
        <div className="p-4 border-r border-[var(--border)] text-center">
          <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">24h Volume</div>
          <div className="text-lg font-bold text-white">$128.4M</div>
        </div>
        <div className="p-4 border-r border-[var(--border)] text-center">
          <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Trending Pairs</div>
          <div className="text-lg font-bold text-[var(--accent)]">1,204</div>
        </div>
        <div className="p-4 border-r border-[var(--border)] text-center md:border-r">
          <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">BSC Gas</div>
          <div className="text-lg font-bold text-[var(--up)]">3 Gwei</div>
        </div>
        <div className="p-4 text-center">
          <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Update In</div>
          <div className="text-lg font-bold text-white">
            <span className="inline-block animate-pulse">●</span> 5s
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 overflow-x-auto">
        <TrendingTable />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[#0e1216] py-6 text-center">
        <p className="text-xs text-[var(--text-secondary)] font-data">
          DATA SOURCE: DEXSCREENER API • BUILD: NEXT.JS + TAILWIND CSS
        </p>
        <p className="text-[10px] text-[var(--text-secondary)] mt-2">
          © 2024 BSC MEME SCREENER • NOT FINANCIAL ADVICE
        </p>
      </footer>
    </div>
  );
}
