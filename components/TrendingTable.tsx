'use client';

import { useState, useEffect } from 'react';
import { MemeToken } from '@/types';
import { fetchChineseTrendingTokens } from '@/lib/trending-api';

type Timeframe = '1h' | '6h' | '24h';

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

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F3BA2F] mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadTokens}
            className="px-6 py-2 bg-[#F3BA2F] hover:bg-[#F3BA2F]/90 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <h2 className="font-semibold text-gray-700">实时热门项目</h2>
        <div className="flex gap-2">
          {(['1h', '6h', '24h'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-medium rounded shadow-sm transition-all ${
                timeframe === tf
                  ? 'bg-white border border-gray-200 text-gray-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {tokens.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                <th className="px-6 py-4"># 代币</th>
                <th className="px-6 py-4 text-right">价格</th>
                <th className="px-6 py-4 text-right">24H 涨跌</th>
                <th className="px-6 py-4 text-right">市值</th>
                <th className="px-6 py-4 text-right">24H 交易量</th>
                <th className="px-6 py-4 text-center">趋势</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tokens.map((token, index) => (
                <tr
                  key={token.address}
                  className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                >
                  {/* Token Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F3BA2F] to-[#F0B90B] flex items-center justify-center text-white text-xs font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {token.name} <span className="text-gray-400">({token.symbol})</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {token.address.slice(0, 6)}...{token.address.slice(-4)}{' '}
                          <button
                            onClick={() => copyAddress(token.address)}
                            className="group-hover:text-blue-500 inline-block"
                            title="复制地址"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-right font-mono text-sm">
                    {formatPrice(token.price)}
                  </td>

                  {/* 24h Change */}
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        token.priceChange24h >= 0
                          ? 'bg-green-50 text-green-500'
                          : 'bg-red-50 text-red-500'
                      }`}
                    >
                      {formatChange(token.priceChange24h)}
                    </span>
                  </td>

                  {/* Market Cap */}
                  <td className="px-6 py-4 text-right font-mono text-sm">
                    {formatNumber(token.marketCap)}
                  </td>

                  {/* Volume 24h */}
                  <td className="px-6 py-4 text-right font-mono text-sm text-gray-600">
                    {formatNumber(token.volume24h)}
                  </td>

                  {/* Trend Sparkline */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <svg width="60" height="20" className="overflow-visible">
                        <polyline
                          fill="none"
                          stroke={token.priceChange24h >= 0 ? '#10b981' : '#ef4444'}
                          strokeWidth="2"
                          points={generateSparklinePoints(token.priceChange24h)}
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500 mb-2">暂时没有找到热门的中文 Meme 币</p>
          <p className="text-xs text-gray-400">尝试切换时间范围或稍后再试</p>
        </div>
      )}
    </div>
  );
}

// 生成趋势线点位（模拟数据）
function generateSparklinePoints(change: number): string {
  const points = [];
  const isPositive = change >= 0;
  const baseY = 10;
  const amplitude = 8;

  for (let i = 0; i < 5; i++) {
    const x = i * 15;
    const randomness = Math.random() * amplitude - amplitude / 2;
    const trend = isPositive ? -i * 2 : i * 2;
    const y = baseY + trend + randomness;
    points.push(`${x},${Math.max(2, Math.min(18, y))}`);
  }

  return points.join(' ');
}
