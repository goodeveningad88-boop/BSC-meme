'use client';

import TrendingTable from '@/components/TrendingTable';

export default function Home() {

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#F0B90B] via-[#F8D12F] to-[#F0B90B] text-gray-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🔥</span>
                </div>
                <h1 className="text-5xl font-black tracking-tight">
                  BSC 中文 Meme 币
                </h1>
              </div>
              <p className="text-gray-800 text-xl font-medium ml-15">
                实时追踪币安智能链上的热门中文 Meme 代币
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gray-900/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-900/20">
                <p className="text-sm font-semibold text-gray-800 mb-1">数据来源</p>
                <p className="text-xs text-gray-700">DexScreener API</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info & Warning Banner */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">ℹ️</span>
              </div>
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-base">
                  关于本列表
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  展示 BSC 链上热门中文 Meme 币，数据来自 DexScreener API 实时更新。投资前请务必 DYOR。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-100/50 dark:from-red-900/30 dark:to-orange-800/20 border-2 border-red-200 dark:border-red-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-100 mb-2 text-base">
                  风险警告
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                  Meme 币极度投机，波动性大，风险极高。警惕诈骗和 Rug Pull。本站不构成投资建议。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-3">
                  <span className="text-3xl">🔥</span>
                  实时热门中文 Meme 币
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  按交易量和活跃度排序，自动筛选包含中文名称的代币
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <TrendingTable />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-16 border-t-4 border-[#F0B90B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#F0B90B] rounded-lg flex items-center justify-center">
                <span className="text-lg">🔥</span>
              </div>
              <span className="text-xl font-bold text-white">BSC 中文 Meme 币排行榜</span>
            </div>
            <p className="text-sm mb-3">
              数据来源：{' '}
              <a
                href="https://dexscreener.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F0B90B] hover:text-[#F8D12F] font-semibold transition-colors"
              >
                DexScreener
              </a>
              {' '}·{' '}
              <a
                href="https://pancakeswap.finance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F0B90B] hover:text-[#F8D12F] font-semibold transition-colors"
              >
                PancakeSwap
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Built with Next.js & Tailwind CSS | 中文社区版 © 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
