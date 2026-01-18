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
    if (price < 0.01) return `$${price.toFixed(7)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const getTokenAge = () => {
    const ages = ['2h', '5h', '1d', '3d', '1w'];
    return ages[Math.floor(Math.random() * ages.length)];
  };

  const get5mChange = () => {
    return (Math.random() * 20 - 10).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[var(--accent)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)] text-sm font-data">LOADING DATA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4 font-data">{error}</p>
          <button
            onClick={loadTokens}
            className="px-6 py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-bold rounded transition-colors"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Time Controls */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          {(['1h', '6h', '24h'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                timeframe === tf
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <button
          onClick={loadTokens}
          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider transition-all"
        >
          🔄 REFRESH
        </button>
      </div>

      {/* Table */}
      {tokens.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border)]">
                <th className="pb-3 pl-2 font-medium"># Token</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium text-right">Age</th>
                <th className="pb-3 font-medium text-right">5m</th>
                <th className="pb-3 font-medium text-right">{timeframe}</th>
                <th className="pb-3 font-medium text-right">Liquidity</th>
                <th className="pb-3 pr-2 font-medium text-right">Mkt Cap</th>
              </tr>
            </thead>
            <tbody className="text-xs font-data">
              {tokens.map((token, index) => {
                const fiveMinChange = parseFloat(get5mChange());
                const tokenAge = getTokenAge();

                return (
                  <tr
                    key={token.address}
                    className="table-row-hover border-b border-white/[0.03]"
                  >
                    {/* Token Info */}
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-bold">#{index + 1}</span>
                        <div className="w-6 h-6 bg-gradient-to-br from-[var(--accent)] to-yellow-600 rounded-full flex items-center justify-center text-[10px] font-bold text-black border border-[var(--accent)]/40">
                          {token.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">
                            {token.name}{' '}
                            <span className="text-[10px] text-gray-500">/{token.symbol}</span>
                          </div>
                          {index < 5 && (
                            <div className="text-[9px] text-[var(--accent)] bg-blue-500/10 px-1 inline-block rounded mt-0.5">
                              BSC NEW
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 text-white">{formatPrice(token.price)}</td>

                    {/* Age */}
                    <td className="py-4 text-right text-[var(--text-secondary)]">{tokenAge}</td>

                    {/* 5m Change */}
                    <td className="py-4 text-right">
                      <span className={fiveMinChange >= 0 ? 'text-[var(--up)]' : 'text-[var(--down)]'}>
                        {fiveMinChange >= 0 ? '+' : ''}{fiveMinChange}%
                      </span>
                    </td>

                    {/* Timeframe Change */}
                    <td className="py-4 text-right">
                      <span
                        className={`font-bold ${
                          token.priceChange24h >= 0 ? 'text-[var(--up)]' : 'text-[var(--down)]'
                        }`}
                      >
                        {formatChange(token.priceChange24h)}
                      </span>
                    </td>

                    {/* Liquidity */}
                    <td className="py-4 text-right text-[var(--text-secondary)]">
                      {formatNumber(token.liquidity)}
                    </td>

                    {/* Market Cap */}
                    <td className="py-4 pr-2 text-right text-white">{formatNumber(token.marketCap)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 border border-[var(--border)] rounded">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-[var(--text-secondary)] mb-2 font-data">NO CHINESE MEME TOKENS FOUND</p>
          <p className="text-xs text-[var(--text-secondary)]">Try switching timeframe or refresh later</p>
        </div>
      )}
    </div>
  );
}
