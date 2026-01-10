import axios from 'axios';
import { MemeToken } from '@/types';
import { getChineseMemeTokenAddresses, getTokenInfoByAddress } from './chinese-meme-tokens';
import { fetchPancakeSwapTokensByAddresses } from './pancakeswap-api';

/**
 * 混合 API 策略：优先使用 PancakeSwap，回退到 DexScreener
 * 这样可以获取最准确的 BSC 链上数据
 */

const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex';

export async function fetchChineseMemeTokens(): Promise<MemeToken[]> {
  const addresses = getChineseMemeTokenAddresses();

  console.log('Fetching Chinese meme tokens from PancakeSwap...');

  try {
    // 方法1：从 PancakeSwap 获取（更可靠，专注 BSC）
    const pancakeTokens = await fetchPancakeSwapTokensByAddresses(addresses);

    if (pancakeTokens.length > 0) {
      console.log(`Got ${pancakeTokens.length} tokens from PancakeSwap`);

      const memeTokens: MemeToken[] = pancakeTokens.map((token) => {
        const chineseInfo = getTokenInfoByAddress(token.address);

        return {
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          price: parseFloat(token.price || '0'),
          priceChange24h: 0, // PancakeSwap API 不提供，需要额外计算
          marketCap: 0, // 需要从其他来源获取
          volume24h: 0, // 需要从其他来源获取
          liquidity: 0,
          bscscanUrl: `https://bscscan.com/token/${token.address}`,
          website: chineseInfo?.community.website,
          twitter: chineseInfo?.community.twitter,
          telegram: chineseInfo?.community.telegram,
        };
      });

      return memeTokens;
    }
  } catch (error) {
    console.error('PancakeSwap API failed, falling back to DexScreener:', error);
  }

  // 方法2：回退到 DexScreener
  console.log('Fetching from DexScreener...');
  const tokens: MemeToken[] = [];

  for (const address of addresses) {
    try {
      const response = await axios.get(`${DEXSCREENER_API}/tokens/${address}`);

      if (response.data && response.data.pairs && response.data.pairs.length > 0) {
        const bscPairs = response.data.pairs.filter((p: any) => p.chainId === 'bsc');

        if (bscPairs.length > 0) {
          const pair = bscPairs[0];
          const chineseInfo = getTokenInfoByAddress(address);

          tokens.push({
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
            website: chineseInfo?.community.website || pair.info?.websites?.[0]?.url,
            twitter: chineseInfo?.community.twitter || pair.info?.socials?.find((s: any) => s.type === 'twitter')?.url,
            telegram: chineseInfo?.community.telegram || pair.info?.socials?.find((s: any) => s.type === 'telegram')?.url,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching token ${address}:`, error);
    }
  }

  console.log(`Got ${tokens.length} tokens from DexScreener`);
  return tokens;
}

/**
 * 搜索 BSC 上的 meme 币
 */
export async function searchBSCMemeTokens(keywords: string[]): Promise<MemeToken[]> {
  const tokens: MemeToken[] = [];

  for (const keyword of keywords) {
    try {
      console.log(`Searching for: ${keyword}`);
      const response = await axios.get(`${DEXSCREENER_API}/search?q=${keyword}`);

      if (response.data && response.data.pairs) {
        const bscPairs = response.data.pairs
          .filter((p: any) => p.chainId === 'bsc' && p.priceUsd)
          .slice(0, 2); // 每个关键词取前2个

        for (const pair of bscPairs) {
          tokens.push({
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
    } catch (error) {
      console.error(`Error searching ${keyword}:`, error);
    }
  }

  return tokens;
}
