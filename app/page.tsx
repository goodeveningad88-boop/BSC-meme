'use client';

import TrendingTable from '@/components/TrendingTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F3BA2F] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            BSC 中文 Meme <span className="text-gray-400 font-normal">Screener</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-gray-100 px-3 py-1.5 rounded-md text-xs font-medium text-gray-500">
            Gas: <span className="text-[#F3BA2F] ml-1">1.2 Gwei</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#111827] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
          >
            刷新数据
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">24H 交易量</p>
            <p className="text-2xl font-bold font-mono">
              $12.4M <span className="text-green-500 text-sm font-normal ml-2">↑ 12%</span>
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-[#F3BA2F]">
            <p className="text-sm text-gray-500 mb-1">热门叙事</p>
            <p className="text-2xl font-bold italic">#AI #Meme</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">实时在线币种</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold font-mono text-[#F3BA2F]">1,284</p>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <TrendingTable />
        </div>
      </main>
    </div>
  );
}
