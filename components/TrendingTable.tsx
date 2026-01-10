'use client';

import { useState, useEffect } from 'react';
import { MemeToken } from '@/types';
import { fetchChineseTrendingTokens } from '@/lib/trending-api';
import Image from 'next/image';

type Timeframe = '1h' | '6h' | '24h';

// Token Avatar Component with multi-source fallback
function TokenAvatar({ token }: { token: MemeToken }) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [allFailed, setAllFailed] = useState(false);

  // 生成一个基于代币符号的颜色
  const getGradientColors = (symbol: string) => {
    const colors = [
      ['from-red-400', 'to-pink-600'],
      ['from-yellow-400', 'to-orange-600'],
      ['from-green-400', 'to-teal-600'],
      ['from-blue-400', 'to-indigo-600'],
      ['from-purple-400', 'to-pink-600'],
      ['from-orange-400', 'to-red-600'],
      ['from-cyan-400', 'to-blue-600'],
      ['from-lime-400', 'to-green-600'],
    ];
    const index = symbol.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const [fromColor, toColor] = getGradientColors(token.symbol);

  // 构建多个可能的头像源（按优先级）
  const getAvatarUrls = () => {
    const urls: string[] = [];

    // 1. DexScreener 提供的 Logo
    if (token.logoUrl) {
      urls.push(token.logoUrl);
    }

    // 2. Trust Wallet Assets (BSC)
    const checksumAddress = token.address;
    urls.push(
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${checksumAddress}/logo.png`
    );

    // 3. TokenLogo API (多链支持)
    urls.push(
      `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@latest/128/color/${token.symbol.toLowerCase()}.png`
    );

    return urls;
  };

  const avatarUrls = getAvatarUrls();
  const currentUrl = avatarUrls[currentUrlIndex];

  const handleError = () => {
    // 尝试下一个 URL
    if (currentUrlIndex < avatarUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
      setIsLoading(true);
    } else {
      // 所有 URL 都失败了
      setAllFailed(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setAllFailed(false);
  };

  // 如果所有图片源都失败了，显示首字母
  if (allFailed || !currentUrl) {
    return (
      <div className={`w-8 h-8 bg-gradient-to-br ${fromColor} ${toColor} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
        {token.symbol.charAt(0)}
      </div>
    );
  }

  // 尝试加载当前 URL
  return (
    <div className="relative w-8 h-8">
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br ${fromColor} ${toColor} rounded-full animate-pulse`} />
      )}
      <Image
        key={currentUrl} // 强制重新渲染
        src={currentUrl}
        alt={token.name}
        width={32}
        height={32}
        className="rounded-full"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

export default function TrendingTable() {
  const [tokens, setTokens] = useState<MemeToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1h');

  useEffect(() => {
    loadTokens();
  }, [timeframe]);

  const loadTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchChineseTrendingTokens(timeframe);
      setTokens(data);
    } catch (err) {
      setError('加载失败，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.000001) return `$${price.toExponential(2)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">正在加载热门中文 Meme 币...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadTokens}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">时间范围</span>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {(['1h', '6h', '24h'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-[#F0B90B] text-gray-900 shadow-md'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={loadTokens}
          className="px-5 py-2 bg-gradient-to-r from-[#F0B90B] to-[#F8D12F] hover:from-[#F8D12F] hover:to-[#F0B90B] text-gray-900 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
        >
          🔄 刷新
        </button>
      </div>

      {/* Table */}
      {tokens.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">#</th>
                <th className="text-left py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">代币</th>
                <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">价格</th>
                <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">24h 涨跌</th>
                <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">市值</th>
                <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">交易量 24h</th>
                <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">流动性</th>
                <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">链接</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {tokens.map((token, index) => (
                <tr
                  key={token.address}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-orange-50/30 dark:hover:from-gray-800/80 dark:hover:to-gray-800/50 transition-all duration-200 group"
                >
                  {/* Rank */}
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${index < 3 ? 'text-[#F0B90B] text-lg' : 'text-gray-500 dark:text-gray-400'}`}>
                        {index + 1}
                      </span>
                      {index < 3 && (
                        <span className="text-xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Token Info */}
                  <td className="py-5 px-4">
                    <div>
                      <div className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#F0B90B] transition-colors">
                        {token.name}
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                        {token.symbol}
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-5 px-4 text-right font-mono font-semibold text-gray-900 dark:text-white">
                    {formatPrice(token.price)}
                  </td>

                  {/* 24h Change */}
                  <td className="py-5 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg font-bold font-mono text-sm ${
                        token.priceChange24h >= 0
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {formatChange(token.priceChange24h)}
                    </span>
                  </td>

                  {/* Market Cap */}
                  <td className="py-5 px-4 text-right font-mono font-semibold text-gray-900 dark:text-white">
                    {formatNumber(token.marketCap)}
                  </td>

                  {/* Volume 24h */}
                  <td className="py-5 px-4 text-right font-mono font-semibold text-gray-900 dark:text-white">
                    {formatNumber(token.volume24h)}
                  </td>

                  {/* Liquidity */}
                  <td className="py-5 px-4 text-right font-mono font-semibold text-gray-900 dark:text-white">
                    {formatNumber(token.liquidity)}
                  </td>

                  {/* Links */}
                  <td className="py-5 px-4">
                    <div className="flex gap-1.5 justify-center">
                      <a
                        href={token.bscscanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#F0B90B] hover:bg-[#F8D12F] text-gray-900 text-xs font-bold rounded-lg transition-all hover:scale-105"
                        title="BscScan"
                      >
                        BSC
                      </a>
                      {token.website && (
                        <a
                          href={token.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all hover:scale-105"
                          title="Website"
                        >
                          🌐
                        </a>
                      )}
                      {token.twitter && (
                        <a
                          href={token.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all hover:scale-105"
                          title="Twitter"
                        >
                          𝕏
                        </a>
                      )}
                      {token.telegram && (
                        <a
                          href={token.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all hover:scale-105"
                          title="Telegram"
                        >
                          ✈️
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
            暂时没有找到热门的中文 Meme 币
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            尝试切换时间范围或稍后再试
          </p>
        </div>
      )}

      {/* Token Count */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm">
        <div className="bg-gradient-to-r from-[#F0B90B] to-[#F8D12F] text-gray-900 px-4 py-2 rounded-full font-bold shadow-md">
          显示 {tokens.length} 个中文 Meme 币
        </div>
      </div>
    </div>
  );
}
