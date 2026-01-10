import axios from 'axios';

const BSCSCAN_API = 'https://api.bscscan.com/api';

// 需要在 BscScan 注册获取免费 API Key: https://bscscan.com/apis
// 将 API Key 添加到 .env.local 文件中
const API_KEY = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || '';

export interface BscScanTokenInfo {
  contractAddress: string;
  tokenName: string;
  symbol: string;
  divisor: string;
  tokenType: string;
  totalSupply: string;
  blueCheckmark: string;
  description: string;
  website: string;
  email: string;
  blog: string;
  reddit: string;
  slack: string;
  facebook: string;
  twitter: string;
  bitcointalk: string;
  github: string;
  telegram: string;
  wechat: string;
  linkedin: string;
  discord: string;
  whitepaper: string;
  tokenPriceUSD: string;
}

/**
 * 获取代币信息（需要 API Key）
 */
export async function fetchBscScanTokenInfo(
  contractAddress: string
): Promise<BscScanTokenInfo | null> {
  if (!API_KEY) {
    console.warn('BscScan API Key not configured');
    return null;
  }

  try {
    const response = await axios.get(BSCSCAN_API, {
      params: {
        module: 'token',
        action: 'tokeninfo',
        contractaddress: contractAddress,
        apikey: API_KEY,
      },
    });

    if (response.data.status === '1' && response.data.result) {
      return response.data.result[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching BscScan token info:', error);
    return null;
  }
}

/**
 * 获取代币持有人数量
 */
export async function fetchTokenHolderCount(
  contractAddress: string
): Promise<number> {
  if (!API_KEY) {
    return 0;
  }

  try {
    const response = await axios.get(BSCSCAN_API, {
      params: {
        module: 'token',
        action: 'tokenholderlist',
        contractaddress: contractAddress,
        page: 1,
        offset: 1,
        apikey: API_KEY,
      },
    });

    if (response.data.status === '1' && response.data.result) {
      return parseInt(response.data.result.length || '0');
    }

    return 0;
  } catch (error) {
    console.error('Error fetching token holder count:', error);
    return 0;
  }
}

/**
 * 获取代币总供应量
 */
export async function fetchTokenSupply(contractAddress: string): Promise<string> {
  if (!API_KEY) {
    return '0';
  }

  try {
    const response = await axios.get(BSCSCAN_API, {
      params: {
        module: 'stats',
        action: 'tokensupply',
        contractaddress: contractAddress,
        apikey: API_KEY,
      },
    });

    if (response.data.status === '1' && response.data.result) {
      return response.data.result;
    }

    return '0';
  } catch (error) {
    console.error('Error fetching token supply:', error);
    return '0';
  }
}

/**
 * 如何获取 BscScan API Key:
 * 1. 访问 https://bscscan.com/
 * 2. 注册/登录账号
 * 3. 访问 https://bscscan.com/myapikey
 * 4. 创建免费的 API Key
 * 5. 将 API Key 添加到项目根目录的 .env.local 文件：
 *    NEXT_PUBLIC_BSCSCAN_API_KEY=你的API密钥
 */
