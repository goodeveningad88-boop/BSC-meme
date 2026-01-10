import axios from 'axios';

const PANCAKESWAP_API = 'https://api.pancakeswap.info/api/v2';

export interface PancakeSwapToken {
  name: string;
  symbol: string;
  address: string;
  price: string;
  price_BNB: string;
}

export interface PancakeSwapTokenData {
  updated_at: number;
  data: {
    [address: string]: PancakeSwapToken;
  };
}

/**
 * 获取 PancakeSwap 上的所有代币信息
 * 返回前1000个流动性最高的代币
 */
export async function fetchPancakeSwapTokens(): Promise<PancakeSwapToken[]> {
  try {
    const response = await axios.get<PancakeSwapTokenData>(`${PANCAKESWAP_API}/tokens`);

    if (!response.data || !response.data.data) {
      return [];
    }

    // 转换为数组
    const tokens = Object.values(response.data.data);

    // 按价格排序（可选）
    return tokens.sort((a, b) => {
      const priceA = parseFloat(a.price || '0');
      const priceB = parseFloat(b.price || '0');
      return priceB - priceA;
    });
  } catch (error) {
    console.error('Error fetching PancakeSwap tokens:', error);
    return [];
  }
}

/**
 * 根据地址获取特定代币信息
 */
export async function fetchPancakeSwapTokenByAddress(address: string): Promise<PancakeSwapToken | null> {
  try {
    const response = await axios.get<PancakeSwapTokenData>(
      `${PANCAKESWAP_API}/tokens/${address}`
    );

    if (!response.data || !response.data.data) {
      return null;
    }

    const tokens = Object.values(response.data.data);
    return tokens[0] || null;
  } catch (error) {
    console.error('Error fetching PancakeSwap token:', error);
    return null;
  }
}

/**
 * 获取多个代币的信息
 */
export async function fetchPancakeSwapTokensByAddresses(
  addresses: string[]
): Promise<PancakeSwapToken[]> {
  const tokens: PancakeSwapToken[] = [];

  for (const address of addresses) {
    try {
      const token = await fetchPancakeSwapTokenByAddress(address);
      if (token) {
        tokens.push(token);
      }
    } catch (error) {
      console.error(`Error fetching token ${address}:`, error);
    }
  }

  return tokens;
}
