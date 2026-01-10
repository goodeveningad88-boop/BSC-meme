import axios from 'axios';
import { MemeToken } from '@/types';

const DEXSCREENER_API = 'https://api.dexscreener.com/token-profiles/latest/v1';
const DEXSCREENER_PAIRS_API = 'https://api.dexscreener.com/latest/dex';

export interface TrendingToken {
  chainId: string;
  tokenAddress: string;
  label?: string;
  icon?: string;
  header?: string;
  description?: string;
  links?: Array<{
    type: string;
    label: string;
    url: string;
  }>;
}

/**
 * 获取 DexScreener 上最新的热门代币
 * 这个 API 会返回最近上线和趋势的代币
 */
export async function fetchTrendingTokens(): Promise<TrendingToken[]> {
  try {
    const response = await axios.get(DEXSCREENER_API);

    if (!response.data) {
      return [];
    }

    // 只返回 BSC 链上的代币
    const bscTokens = response.data.filter((token: TrendingToken) =>
      token.chainId === 'bsc'
    );

    return bscTokens;
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
}

/**
 * 获取特定时间范围的热门代币
 * @param timeframe - '1h' | '6h' | '24h'
 */
export async function fetchTrendingBSCPairs(timeframe: '1h' | '6h' | '24h' = '1h'): Promise<MemeToken[]> {
  try {
    console.log(`Fetching trending BSC pairs for ${timeframe}...`);

    // 方法1: 尝试获取 BSC 上所有交易对，然后筛选中文
    const response = await axios.get(`${DEXSCREENER_PAIRS_API}/pairs/bsc`);

    if (!response.data || !response.data.pairs) {
      console.log('No pairs data returned');
      return [];
    }

    console.log(`Got ${response.data.pairs.length} pairs from BSC`);

    const pairs = response.data.pairs
      .filter((pair: any) => {
        // 必须有价格
        if (!pair.priceUsd) return false;

        // 必须有交易活动
        const txns = pair.txns?.[timeframe === '1h' ? 'h1' : timeframe === '6h' ? 'h6' : 'h24'];
        if (!txns || (txns.buys + txns.sells) < 10) return false;

        // 筛选包含中文字符的代币
        const name = pair.baseToken.name || '';
        const symbol = pair.baseToken.symbol || '';
        return hasChineseCharacters(name) || hasChineseCharacters(symbol);
      })
      .sort((a: any, b: any) => {
        // 按交易数量排序
        const txnsA = a.txns?.[timeframe === '1h' ? 'h1' : timeframe === '6h' ? 'h6' : 'h24'];
        const txnsB = b.txns?.[timeframe === '1h' ? 'h1' : timeframe === '6h' ? 'h6' : 'h24'];
        const totalA = txnsA ? txnsA.buys + txnsA.sells : 0;
        const totalB = txnsB ? txnsB.buys + txnsB.sells : 0;
        return totalB - totalA;
      })
      .slice(0, 50); // 取前50个

    const tokens: MemeToken[] = pairs.map((pair: any) => ({
      address: pair.baseToken.address,
      name: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      logoUrl: pair.info?.imageUrl,
      price: parseFloat(pair.priceUsd || '0'),
      priceChange24h: pair.priceChange?.h24 || 0,
      marketCap: pair.marketCap || pair.fdv || 0,
      volume24h: pair.volume?.h24 || 0,
      liquidity: pair.liquidity?.usd || 0,
      bscscanUrl: `https://bscscan.com/token/${pair.baseToken.address}`,
      website: pair.info?.websites?.[0]?.url,
      twitter: pair.info?.socials?.find((s: any) => s.type === 'twitter')?.url,
      telegram: pair.info?.socials?.find((s: any) => s.type === 'telegram')?.url,
    }));

    console.log(`Found ${tokens.length} Chinese trending tokens for ${timeframe}`);
    return tokens;
  } catch (error) {
    console.error('Error fetching trending BSC pairs:', error);
    return [];
  }
}

/**
 * 检测代币名称是否包含中文字符
 */
export function hasChineseCharacters(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

/**
 * 获取中文 Meme 币（名称包含中文）
 */
export async function fetchChineseTrendingTokens(timeframe: '1h' | '6h' | '24h' = '1h'): Promise<MemeToken[]> {
  try {
    // 方法1: 尝试从 BSC 对列表中筛选
    console.log('Method 1: Fetching from BSC pairs...');
    const allTokens = await fetchTrendingBSCPairs(timeframe);

    if (allTokens.length > 0) {
      console.log(`Method 1 success: Found ${allTokens.length} Chinese tokens`);
      return allTokens;
    }

    // 方法2: 如果方法1失败，直接搜索常见的中文 meme 关键词
    console.log('Method 1 failed, trying Method 2: Searching by keywords...');

    const chineseKeywords = [
      // 从你的截图中提取的实际中文代币名称
      '我踏马', '人生', '周期', '白马', '妹儿', '川渝', '龙门', '开门',
      // 其他可能的中文词汇
      '币安', '发财', '暴富', '牛逼', '冲冲冲', '梭哈'
    ];

    const searchResults: MemeToken[] = [];
    const seenAddresses = new Set<string>();

    for (const keyword of chineseKeywords) {
      try {
        console.log(`Searching for keyword: ${keyword}`);
        const response = await axios.get(`${DEXSCREENER_PAIRS_API}/search?q=${encodeURIComponent(keyword)}`);

        if (response.data && response.data.pairs) {
          const bscPairs = response.data.pairs
            .filter((pair: any) =>
              pair.chainId === 'bsc' &&
              pair.priceUsd &&
              (hasChineseCharacters(pair.baseToken.name) || hasChineseCharacters(pair.baseToken.symbol)) &&
              !seenAddresses.has(pair.baseToken.address.toLowerCase())
            )
            .slice(0, 3); // 每个关键词最多取3个

          for (const pair of bscPairs) {
            seenAddresses.add(pair.baseToken.address.toLowerCase());
            searchResults.push({
              address: pair.baseToken.address,
              name: pair.baseToken.name,
              symbol: pair.baseToken.symbol,
              logoUrl: pair.info?.imageUrl,
              price: parseFloat(pair.priceUsd || '0'),
              priceChange24h: pair.priceChange?.h24 || 0,
              marketCap: pair.marketCap || pair.fdv || 0,
              volume24h: pair.volume?.h24 || 0,
              liquidity: pair.liquidity?.usd || 0,
              bscscanUrl: `https://bscscan.com/token/${pair.baseToken.address}`,
              website: pair.info?.websites?.[0]?.url,
              twitter: pair.info?.socials?.find((s: any) => s.type === 'twitter')?.url,
              telegram: pair.info?.socials?.find((s: any) => s.type === 'telegram')?.url,
            });
          }
        }
      } catch (err) {
        console.error(`Error searching ${keyword}:`, err);
      }
    }

    console.log(`Method 2: Found ${searchResults.length} Chinese tokens by keyword search`);

    // 按交易量排序
    searchResults.sort((a, b) => b.volume24h - a.volume24h);

    return searchResults;
  } catch (error) {
    console.error('Error fetching Chinese trending tokens:', error);
    return [];
  }
}
