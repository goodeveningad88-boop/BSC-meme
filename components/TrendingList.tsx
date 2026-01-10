'use client';

import { useState, useEffect } from 'react';
import { MemeToken } from '@/types';
import { fetchChineseTrendingTokens } from '@/lib/trending-api';
import TokenCard from './TokenCard';

type Timeframe = '1h' | '6h' | '24h';

export default function TrendingList() {
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

  const timeframeLabels: Record<Timeframe, string> = {
    '1h': '近1小时',
    '6h': '近6小时',
    '24h': '近24小时',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            正在加载热门中文 Meme 币...
          </p>
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
      {/* Time Frame Selector */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">时间范围:</span>
          <div className="flex gap-2">
            {(['1h', '6h', '24h'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {timeframeLabels[tf]}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={loadTokens}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          🔄 刷新
        </button>
      </div>

      {/* Token Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          找到 <span className="font-bold text-yellow-600">{tokens.length}</span> 个中文 Meme 币
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          实时数据
        </div>
      </div>

      {/* Token Grid */}
      {tokens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token, index) => (
            <div key={token.address} className="relative">
              {/* Rank Badge */}
              {index < 3 && (
                <div className="absolute -top-3 -left-3 z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                      index === 0
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                        : index === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                        : 'bg-gradient-to-br from-orange-400 to-orange-600'
                    }`}
                  >
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                </div>
              )}
              <TokenCard token={token} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            暂时没有找到热门的中文 Meme 币
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            尝试切换时间范围或稍后再试
          </p>
        </div>
      )}
    </div>
  );
}
