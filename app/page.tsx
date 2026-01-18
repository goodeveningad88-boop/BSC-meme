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
      <main className="flex-grow p-4 md:p-6">
        <div className="w-full max-w-6xl mx-auto mb-8">
          {/* Search Bar */}
          <div className="search-wrapper mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="输入代币名称或合约地址..."
              className="search-input font-data"
            />
            <div className="search-kbd font-data">/</div>
          </div>

          {/* Hot Search Tags */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">
              <svg className="icon-fire" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c0 1.8-1.1 3.2-2.3 4.6C8.5 8 7 9.5 7 11.8c0 2.3 1.9 4.2 4.2 4.2s4.2-1.9 4.2-4.2c0-1.8-1-3.3-2.1-4.6C12.1 6 11 4.5 11 2h1z"/>
              </svg>
              热门搜索:
            </div>

            <div className="flex gap-2 font-data">
              <button className="tag-pill">
                <span className="text-[10px] opacity-50">#1</span> $BOME
              </button>
              <button className="tag-pill">
                <span className="text-[10px] opacity-50">#2</span> $CN-MOON
              </button>
              <button className="tag-pill">
                <span className="text-[10px] opacity-50">#3</span> $DOGE-CN
              </button>
              <button className="tag-pill">
                <span className="text-[10px] opacity-50">#4</span> $CHEEMS
              </button>
              <button className="tag-pill">
                <span className="text-[10px] opacity-50">#5</span> $PUMP
              </button>
              <button className="tag-pill">
                <span className="text-[10px] opacity-50">#6</span> $WIF
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <TrendingTable />
        </div>
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
