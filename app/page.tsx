'use client';

import TrendingTable from '@/components/TrendingTable';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{zIndex: 1}}>
      {/* Header */}
      <header className="relative" style={{ background: '#000000' }}>
        <div className="py-4 px-4 lg:py-6 lg:px-6">
          <div className="max-w-7xl mx-auto">
            {/* 移动端：垂直布局，桌面端：水平布局 */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-5xl font-bold tracking-wide neon-text font-cyber leading-tight">
                  BSC中文MEME看板
                </h1>
                <p className="text-[var(--text-secondary)] text-xs mt-1 tracking-wide">
                  实时追踪 BSC 链上的中文 MEME 代币
                </p>
                <p className="text-[var(--text-secondary)] text-xs mt-2 flex items-center gap-2 font-bold">
                  <span>Tracker制作人：林晚晚的猫@linwanwan823</span>
                  <img
                    src="/avatar.png"
                    alt="林晚晚的猫"
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                  />
                </p>
              </div>

              {/* 搜索框 - 移动端全宽 */}
              <div className="relative w-full lg:w-72 shrink-0">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="搜索代币..."
                  className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-4 px-2 sm:px-3 md:py-8 md:px-6 relative" style={{background: '#000000'}}>
        <div className="max-w-7xl mx-auto">
          {/* Table Container */}
          <div className="relative w-full rounded-lg overflow-hidden" style={{
            background: 'rgba(0, 10, 20, 0.6)',
            border: '1px solid rgba(0, 255, 255, 0.15)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
          }}>
            <TrendingTable />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center" style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs text-[var(--text-secondary)]">
          数据来源: DexScreener API · 仅供参考，不构成投资建议
        </p>
      </footer>
    </div>
  );
}
