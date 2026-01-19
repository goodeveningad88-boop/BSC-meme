'use client';

import { useState, useEffect } from 'react';
import { MemeToken } from '@/types';
import { fetchChineseTrendingTokens } from '@/lib/trending-api';

type Timeframe = '1h' | '6h' | '24h';
type SortField = 'price' | 'change' | 'volume' | 'liquidity' | 'marketCap';
type SortDirection = 'asc' | 'desc';

// 赛博朋克风格的字母头像颜色方案
const CYBER_GRADIENTS = [
  'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)', // 青蓝
  'linear-gradient(135deg, #ff00ff 0%, #8000ff 100%)', // 品红紫
  'linear-gradient(135deg, #00ff88 0%, #00ffff 100%)', // 绿青
  'linear-gradient(135deg, #ff0066 0%, #ff00ff 100%)', // 红粉
  'linear-gradient(135deg, #ffff00 0%, #ff8800 100%)', // 黄橙
  'linear-gradient(135deg, #0080ff 0%, #8000ff 100%)', // 蓝紫
  'linear-gradient(135deg, #00ffff 0%, #00ff88 100%)', // 青绿
  'linear-gradient(135deg, #ff8800 0%, #ff0066 100%)', // 橙红
];

// 代币头像组件
function TokenAvatar({ token }: { token: MemeToken }) {
  const [showFallback, setShowFallback] = useState(false);

  // 当 token 变化时重置状态
  useEffect(() => {
    setShowFallback(false);
  }, [token.address]);

  // 基于代币 symbol 选择渐变色
  const getGradient = () => {
    const hash = token.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return CYBER_GRADIENTS[hash % CYBER_GRADIENTS.length];
  };

  // 获取显示字符（优先中文，否则首字母）
  const getDisplayChar = () => {
    // 查找第一个中文字符
    const chineseMatch = token.symbol.match(/[\u4e00-\u9fa5]/);
    if (chineseMatch) return chineseMatch[0];
    // 否则返回首字母大写
    return token.symbol.charAt(0).toUpperCase();
  };

  // 如果没有 logoUrl 或加载失败，显示字母头像
  if (!token.logoUrl || showFallback) {
    return (
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
        style={{
          background: getGradient(),
        }}
      >
        {getDisplayChar()}
      </div>
    );
  }

  return (
    <img
      src={token.logoUrl}
      alt={token.symbol}
      className="w-8 h-8 rounded-lg shrink-0 object-cover"
      onError={() => setShowFallback(true)}
    />
  );
}

// 排序图标组件
function SortIcon({ field, currentField, direction }: { field: SortField; currentField: SortField | null; direction: SortDirection }) {
  const isActive = field === currentField;
  return (
    <span className="inline-flex flex-col ml-1.5 text-[10px] leading-none gap-0.5">
      <span style={{
        color: isActive && direction === 'asc' ? 'var(--accent)' : 'var(--text-secondary)',
        opacity: isActive && direction === 'asc' ? 1 : 0.3,
      }}>▲</span>
      <span style={{
        color: isActive && direction === 'desc' ? 'var(--accent)' : 'var(--text-secondary)',
        opacity: isActive && direction === 'desc' ? 1 : 0.3,
      }}>▼</span>
    </span>
  );
}

export default function TrendingTable() {
  const [tokens, setTokens] = useState<MemeToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1h');
  const [sortField, setSortField] = useState<SortField | null>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    loadTokens();
  }, [timeframe]);

  const loadTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchChineseTrendingTokens(timeframe);

      // 前端再次去重，确保不显示重复代币（使用 symbol 去重）
      const seenSymbols = new Set<string>();
      const uniqueTokens = data.filter(token => {
        const normalizedSymbol = token.symbol.toLowerCase().replace(/\s+/g, '');
        if (seenSymbols.has(normalizedSymbol)) {
          return false;
        }
        seenSymbols.add(normalizedSymbol);
        return true;
      });

      setTokens(uniqueTokens);
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

  // 获取当前时间范围的涨幅
  const getPriceChange = (token: MemeToken) => {
    if (timeframe === '1h') return token.priceChange1h ?? token.priceChange24h;
    if (timeframe === '6h') return token.priceChange6h ?? token.priceChange24h;
    return token.priceChange24h;
  };

  // 处理排序点击
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // 同一字段，切换方向
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      // 新字段，默认降序
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 排序后的代币列表
  const sortedTokens = [...tokens].sort((a, b) => {
    if (!sortField) return 0;

    let aVal: number, bVal: number;
    switch (sortField) {
      case 'price':
        aVal = a.price;
        bVal = b.price;
        break;
      case 'change':
        aVal = getPriceChange(a);
        bVal = getPriceChange(b);
        break;
      case 'volume':
        aVal = a.volume24h;
        bVal = b.volume24h;
        break;
      case 'liquidity':
        aVal = a.liquidity;
        bVal = b.liquidity;
        break;
      case 'marketCap':
        aVal = a.marketCap;
        bVal = b.marketCap;
        break;
      default:
        return 0;
    }

    return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-80 p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)] text-sm">
            加载中...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-80 p-6">
        <div className="text-center">
          <p className="text-[var(--down)] mb-4 text-sm">{error}</p>
          <button
            onClick={loadTokens}
            className="px-4 py-2 bg-transparent border border-[var(--accent)]/50 text-[var(--accent)] text-sm rounded transition-all hover:bg-[var(--accent)]/10"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Time Controls */}
      <div className="mb-4 sm:mb-5 flex justify-between items-center">
        <div className="flex gap-1.5 sm:gap-2">
          {(['1h', '6h', '24h'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wider transition-all rounded ${
                timeframe === tf
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-transparent border border-[var(--accent)]/30 text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <button
          onClick={loadTokens}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-transparent border border-[var(--accent)]/30 text-[var(--text-secondary)] text-xs font-bold tracking-wide rounded transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] flex items-center gap-1.5 sm:gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
          <span className="hidden sm:inline">刷新</span>
        </button>
      </div>

      {/* Table */}
      {tokens.length > 0 ? (
        <>
          {/* 桌面端表格 */}
          <div className="hidden md:block overflow-x-auto">
            {/* 表头 */}
            <div className="grid grid-cols-6 items-center text-sm tracking-wide py-3 px-2 mb-1" style={{
              borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
              color: 'var(--text-secondary)'
            }}>
              <div className="font-semibold pl-2">代币</div>
              <div
                className="font-semibold text-center cursor-pointer hover:text-[var(--accent)] transition-colors flex items-center justify-center"
                onClick={() => handleSort('price')}
              >
                价格
                <SortIcon field="price" currentField={sortField} direction={sortDirection} />
              </div>
              <div
                className="font-semibold text-center cursor-pointer hover:text-[var(--accent)] transition-colors flex items-center justify-center"
                onClick={() => handleSort('change')}
              >
                {timeframe}涨幅
                <SortIcon field="change" currentField={sortField} direction={sortDirection} />
              </div>
              <div
                className="font-semibold text-center cursor-pointer hover:text-[var(--accent)] transition-colors flex items-center justify-center"
                onClick={() => handleSort('volume')}
              >
                24h交易量
                <SortIcon field="volume" currentField={sortField} direction={sortDirection} />
              </div>
              <div
                className="font-semibold text-center cursor-pointer hover:text-[var(--accent)] transition-colors flex items-center justify-center"
                onClick={() => handleSort('liquidity')}
              >
                流动性
                <SortIcon field="liquidity" currentField={sortField} direction={sortDirection} />
              </div>
              <div
                className="font-semibold text-center cursor-pointer hover:text-[var(--accent)] transition-colors flex items-center justify-center"
                onClick={() => handleSort('marketCap')}
              >
                市值
                <SortIcon field="marketCap" currentField={sortField} direction={sortDirection} />
              </div>
            </div>

            {/* 数据行 */}
            {sortedTokens.map((token, index) => (
              <a
                key={token.address}
                href={`https://bscscan.com/token/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-6 items-center py-3 px-2 rounded-md transition-all hover:bg-[rgba(0,255,255,0.05)] cursor-pointer"
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
                }}
              >
                {/* 代币 */}
                <div className="flex items-center gap-3 pl-2">
                  <span className="text-[var(--text-secondary)] text-xs font-mono w-6 shrink-0">
                    {index + 1}
                  </span>
                  <TokenAvatar token={token} />
                  <div className="text-sm font-semibold text-white whitespace-nowrap flex items-center gap-1.5">
                    {token.symbol}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-secondary)] opacity-0 group-hover:opacity-100">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </div>
                </div>

                {/* 价格 */}
                <div className="font-mono text-sm text-center" style={{color: 'var(--accent)'}}>
                  {formatPrice(token.price)}
                </div>

                {/* 涨幅 */}
                <div className={`font-mono text-sm font-semibold text-center ${
                  getPriceChange(token) >= 0 ? 'text-[var(--up)]' : 'text-[var(--down)]'
                }`}>
                  {formatChange(getPriceChange(token))}
                </div>

                {/* 24h交易量 */}
                <div className="text-white/80 font-mono text-sm text-center">
                  {formatNumber(token.volume24h)}
                </div>

                {/* 流动性 */}
                <div className="text-[var(--text-secondary)] font-mono text-sm text-center">
                  {formatNumber(token.liquidity)}
                </div>

                {/* 市值 */}
                <div className="text-white font-mono text-sm font-semibold text-center">
                  {formatNumber(token.marketCap)}
                </div>
              </a>
            ))}
          </div>

          {/* 移动端卡片布局 */}
          <div className="md:hidden space-y-3">
            {/* 排序选择器 */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] pb-2 border-b border-[rgba(0,255,255,0.1)]">
              <span>排序:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { field: 'marketCap' as SortField, label: '市值' },
                  { field: 'change' as SortField, label: '涨幅' },
                  { field: 'volume' as SortField, label: '交易量' },
                ].map(({ field, label }) => (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      sortField === field
                        ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/50'
                        : 'bg-white/5 text-[var(--text-secondary)] border border-white/10'
                    }`}
                  >
                    {label}
                    {sortField === field && (sortDirection === 'desc' ? '↓' : '↑')}
                  </button>
                ))}
              </div>
            </div>

            {/* 卡片列表 */}
            {sortedTokens.map((token, index) => (
              <a
                key={token.address}
                href={`https://bscscan.com/token/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg transition-all active:scale-[0.98]"
                style={{
                  background: 'rgba(0, 255, 255, 0.03)',
                  border: '1px solid rgba(0, 255, 255, 0.1)'
                }}
              >
                {/* 卡片头部：代币信息和涨幅 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[var(--text-secondary)] text-xs font-mono w-5">
                      {index + 1}
                    </span>
                    <TokenAvatar token={token} />
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-1">
                        {token.symbol}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-secondary)]">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </div>
                      <div className="font-mono text-xs" style={{color: 'var(--accent)'}}>
                        {formatPrice(token.price)}
                      </div>
                    </div>
                  </div>
                  <div className={`font-mono text-base font-bold ${
                    getPriceChange(token) >= 0 ? 'text-[var(--up)]' : 'text-[var(--down)]'
                  }`}>
                    {formatChange(getPriceChange(token))}
                  </div>
                </div>

                {/* 卡片底部：数据网格 */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-black/30 rounded px-2 py-1.5">
                    <div className="text-[var(--text-secondary)] mb-0.5">市值</div>
                    <div className="text-white font-mono font-semibold">{formatNumber(token.marketCap)}</div>
                  </div>
                  <div className="bg-black/30 rounded px-2 py-1.5">
                    <div className="text-[var(--text-secondary)] mb-0.5">流动性</div>
                    <div className="text-white/80 font-mono">{formatNumber(token.liquidity)}</div>
                  </div>
                  <div className="bg-black/30 rounded px-2 py-1.5">
                    <div className="text-[var(--text-secondary)] mb-0.5">24h量</div>
                    <div className="text-white/80 font-mono">{formatNumber(token.volume24h)}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-4 opacity-30">📊</div>
          <p className="text-[var(--text-secondary)] mb-2 text-sm">
            未找到中文MEME代币
          </p>
          <p className="text-xs text-[var(--text-secondary)]/60">
            尝试切换时间范围或稍后刷新
          </p>
        </div>
      )}
    </div>
  );
}
