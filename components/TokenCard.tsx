'use client';

import { MemeToken } from '@/types';
import { formatNumber, formatPrice } from '@/lib/api';
import Image from 'next/image';

interface TokenCardProps {
  token: MemeToken;
}

export default function TokenCard({ token }: TokenCardProps) {
  const isPositive = token.priceChange24h >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700">
      {/* Header with Logo and Name */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {token.logoUrl ? (
            <Image
              src={token.logoUrl}
              alt={token.name}
              width={48}
              height={48}
              className="rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {token.symbol.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {token.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {token.symbol}
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isPositive
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}
        >
          {isPositive ? '+' : ''}
          {token.priceChange24h.toFixed(2)}%
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatPrice(token.price)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Market Cap
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatNumber(token.marketCap)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Volume 24h
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatNumber(token.volume24h)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Liquidity
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatNumber(token.liquidity)}
          </p>
        </div>
        {token.holders && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Holders
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {token.holders.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Contract Address */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Contract Address
        </p>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200 flex-1 truncate">
            {token.address}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(token.address)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
            title="Copy address"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-2">
        <a
          href={token.bscscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded transition-colors"
        >
          BscScan
        </a>
        {token.website && (
          <a
            href={token.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
          >
            Website
          </a>
        )}
        {token.twitter && (
          <a
            href={token.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded transition-colors"
          >
            Twitter
          </a>
        )}
        {token.telegram && (
          <a
            href={token.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
          >
            Telegram
          </a>
        )}
      </div>
    </div>
  );
}
