import axios from 'axios';

/**
 * 多源头像获取器
 * 按优先级从多个来源获取代币头像
 */

interface AvatarSources {
  dexscreener?: string;
  trustwallet?: string;
  coingecko?: string;
  generated?: string;
}

// Trust Wallet 的代币图标 CDN
const TRUST_WALLET_CDN = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets';

// CoinGecko 图标 CDN (不需要 API key)
const COINGECKO_CDN = 'https://assets.coingecko.com/coins/images';

/**
 * 获取代币的所有可能头像源
 */
export async function getTokenAvatarSources(
  address: string,
  dexscreenerUrl?: string
): Promise<AvatarSources> {
  const checksumAddress = toChecksumAddress(address);

  return {
    dexscreener: dexscreenerUrl,
    trustwallet: `${TRUST_WALLET_CDN}/${checksumAddress}/logo.png`,
    // 注意: CoinGecko 需要代币 ID，这里只是示例格式
    coingecko: undefined, // 需要额外的 API 调用来获取代币 ID
    generated: `https://ui-avatars.com/api/?name=${encodeURIComponent(address.slice(2, 4))}&background=random&size=128`,
  };
}

/**
 * 按优先级尝试获取可用的头像 URL
 */
export async function getBestAvatar(
  address: string,
  dexscreenerUrl?: string
): Promise<string | null> {
  const sources = await getTokenAvatarSources(address, dexscreenerUrl);

  // 优先级: DexScreener > Trust Wallet > 生成头像
  const urlsToTry = [
    sources.dexscreener,
    sources.trustwallet,
  ].filter(Boolean) as string[];

  for (const url of urlsToTry) {
    try {
      // 尝试请求图片，检查是否存在
      const response = await axios.head(url, { timeout: 3000 });
      if (response.status === 200) {
        return url;
      }
    } catch (error) {
      // 继续尝试下一个源
      continue;
    }
  }

  // 都失败了，返回 null（使用备用方案）
  return null;
}

/**
 * 将地址转换为校验和格式（BSC 使用 EIP-55）
 */
function toChecksumAddress(address: string): string {
  // 简化版本，实际应该使用 web3 或 ethers 的实现
  // 这里先返回原地址
  return address;
}

/**
 * 批量获取多个代币的头像
 */
export async function getBatchAvatars(
  tokens: Array<{ address: string; logoUrl?: string }>
): Promise<Map<string, string>> {
  const avatarMap = new Map<string, string>();

  // 并发请求，但限制并发数
  const batchSize = 5;
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (token) => {
        try {
          const avatar = await getBestAvatar(token.address, token.logoUrl);
          if (avatar) {
            avatarMap.set(token.address.toLowerCase(), avatar);
          }
        } catch (error) {
          console.error(`Error fetching avatar for ${token.address}:`, error);
        }
      })
    );
  }

  return avatarMap;
}

/**
 * 验证图片 URL 是否有效（客户端使用）
 */
export function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;

    // 3秒超时
    setTimeout(() => resolve(false), 3000);
  });
}
