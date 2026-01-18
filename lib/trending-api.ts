import axios from 'axios';
import { MemeToken } from '@/types';

const DEXSCREENER_API = 'https://api.dexscreener.com/token-profiles/latest/v1';
const DEXSCREENER_PAIRS_API = 'https://api.dexscreener.com/latest/dex';
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BINANCE_ALPHA_API = 'https://www.binance.com/bapi/defi/v1/public/wallet-direct/buw/wallet/cex/alpha/all/token/list';
// Four.meme 是币安钱包合作的 BSC meme 平台
const FOUR_MEME_SEARCH = 'four.meme';

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

// 已知的热门中文 MEME 代币地址（BSC 基金会购买过的等）
const KNOWN_CHINESE_MEME_ADDRESSES = [
  // BSC 基金会购买过的代币
  '0x924fa68a0fc644485b8df8abfa0a41c2e7744444', // 币安人生 BinanceLife
  '0x1a5f9d77ca46646cd4937fd8d093f460b66f4444', // 老子 Laozi
  '0xc51a9250795c0186a6fb4a7d20a90330651e4444', // 我踏马来了
  '0x82Ec31D69b3c289E541b50E30681FD1ACAd24444', // 哈基米 HAJIMI
  '0x72ebd97bdee49b66cc1a58cca36fa9fa63c14444', // 人生K线
  '0x99da649a42c59f7c547c06c6c273f1a3b2bc4444', // 踏空人生
  '0x1a1e69f1e6182e2f8b9e8987e83c016ac9444444', // 人生K线 (另一个)

];

// 需要排除的非中文代币（这些代币虽然可能被关键词搜索到，但不是真正的中文 MEME）
const EXCLUDED_TOKENS = [
  'doge', 'shib', 'shiba', 'pepe', 'floki', 'bonk', 'wif', 'meme',
  'dora', 'babydoge', 'safemoon', 'saitama', 'akita', 'kishu',
  'elon', 'moon', 'rocket', 'inu', 'wojak', 'chad', 'based',
];

// 中文 MEME 搜索关键词 - 只保留纯中文词汇，避免匹配到英文代币
const CHINESE_KEYWORDS = [
  // BSC 基金会购买/热门项目
  '老子', '黑马', '白马', '牛马', '龙马', '千里马',
  '我踏马', '踏马', '人生K线', 'K线',
  '超级周期', '爸爸', '妈妈', '孙子', '川普', '幺妹儿',

  // 币安生态相关（只用中文）
  '币安', '何一', '赵长鹏', '一姐', '一哥', '币安人生',
  '比特币', '以太坊', '安',

  // 热门 MEME 主题（纯中文）
  '发财', '暴富', '牛逼', '梭哈', '财神', '财富',
  '躺赢', '暴涨', '起飞', '登月', '百倍',
  '千倍', '万倍', '翻倍', '冲冲冲',
  '自由', '丰收', '丰收人生',

  // 生肖/动物（纯中文）
  '金龙', '神龙', '金虎', '玉兔',
  '金狗', '土狗', '神狗', '旺财',
  '喵星人', '哈基米',

  // 节日/时事
  '春晚', '新年快乐', '红包', '过年',
  '福气', '喜庆', '富贵', '吉祥如意',
  '迎春', '联欢', '春节',

  // 地区
  '中国梦', '香港仔', '深圳湾', '上海滩', '北京城', '广州塔', '成都人',
  '川渝', '四川', '重庆', '东北', '广东仔',

  // 网络流行语/梗
  '韭菜', '打工人', '躺平族', '内卷', '摆烂',
  '绝绝子', '永远的神',
  '兄弟们', '姐妹们', '宝贝儿',
  '钻石手', '纸手',

  // 互联网/科技（纯中文）
  '抖音', '快手', '微信', '支付宝', '淘宝', '拼多多',
  '人工智能', '机器人', '元宇宙',

  // 宗教/神话
  '财神爷', '菩萨', '观音', '如来佛',
  '悟空', '八戒', '唐僧', '西游',

  // 食物/生活
  '火锅', '烧烤', '奶茶',
  '麻将',

  // 其他热门中文
  '龙门', '妹儿', '币圈', '链圈',
  '空投', '挖矿', '质押'
];

/**
 * 检测代币名称是否包含中文字符
 */
export function hasChineseCharacters(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

/**
 * 获取代币头像的缓存
 */
const tokenIconCache = new Map<string, string>();
let coingeckoTokensLoaded = false;

/**
 * 从 CoinGecko 加载 BSC 代币列表（用于获取头像）
 */
async function loadCoingeckoTokens(): Promise<void> {
  if (coingeckoTokensLoaded) return;

  try {
    console.log('Loading CoinGecko BSC token list...');
    const response = await axios.get('https://tokens.coingecko.com/binance-smart-chain/all.json');
    const tokens = response.data?.tokens || [];

    for (const token of tokens) {
      if (token.address && token.logoURI) {
        tokenIconCache.set(token.address.toLowerCase(), token.logoURI);
      }
    }

    console.log(`Loaded ${tokens.length} tokens from CoinGecko`);
    coingeckoTokensLoaded = true;
  } catch (error) {
    console.error('Error loading CoinGecko tokens:', error);
  }
}

/**
 * 生成代币头像候选 URL 列表
 */
function getTokenIconUrls(address: string): string[] {
  const checksumAddr = address; // 保持原始大小写
  const lowerAddr = address.toLowerCase();

  return [
    // Trust Wallet
    `https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/${checksumAddr}/logo.png`,
    // PancakeSwap
    `https://tokens.pancakeswap.finance/images/${checksumAddr}.png`,
    // CoinGecko (需要从列表获取)
    // BscScan
    `https://bscscan.com/token/images/${lowerAddr.slice(2, 10)}_32.png`,
  ];
}

/**
 * 批量获取代币头像
 */
async function fetchTokenIcons(addresses: string[]): Promise<Map<string, string>> {
  const iconMap = new Map<string, string>();

  // 先尝试从 CoinGecko 缓存获取
  await loadCoingeckoTokens();

  // 检查缓存
  const uncachedAddresses: string[] = [];
  for (const addr of addresses) {
    const cached = tokenIconCache.get(addr.toLowerCase());
    if (cached) {
      iconMap.set(addr.toLowerCase(), cached);
    } else {
      uncachedAddresses.push(addr);
    }
  }

  if (uncachedAddresses.length === 0) {
    return iconMap;
  }

  try {
    // 使用 DexScreener tokens API 批量获取代币信息（最多30个）
    const batchSize = 30;
    for (let i = 0; i < uncachedAddresses.length; i += batchSize) {
      const batch = uncachedAddresses.slice(i, i + batchSize);
      const addressList = batch.join(',');

      const response = await axios.get(`${DEXSCREENER_PAIRS_API}/tokens/${addressList}`);

      if (response.data && response.data.pairs) {
        for (const pair of response.data.pairs) {
          const addr = pair.baseToken?.address?.toLowerCase();
          const imageUrl = pair.info?.imageUrl;
          if (addr && imageUrl) {
            iconMap.set(addr, imageUrl);
            tokenIconCache.set(addr, imageUrl);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching token icons from DexScreener:', error);
  }

  // 对于还没有头像的，生成候选 URL（前端会处理加载失败的情况）
  for (const addr of uncachedAddresses) {
    if (!iconMap.has(addr.toLowerCase())) {
      // 使用 Trust Wallet 格式作为默认尝试
      const trustWalletUrl = `https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/${addr}/logo.png`;
      iconMap.set(addr.toLowerCase(), trustWalletUrl);
    }
  }

  return iconMap;
}

/**
 * 从 pair 数据转换为 MemeToken
 */
function pairToMemeToken(pair: any): MemeToken {
  // 只使用真实的 marketCap，不使用 fdv
  const marketCap = pair.marketCap || 0;
  const liquidity = pair.liquidity?.usd || 0;

  return {
    address: pair.baseToken.address,
    name: pair.baseToken.name,
    symbol: pair.baseToken.symbol,
    logoUrl: pair.info?.imageUrl,
    price: parseFloat(pair.priceUsd || '0'),
    priceChange1h: pair.priceChange?.h1 || 0,
    priceChange6h: pair.priceChange?.h6 || 0,
    priceChange24h: pair.priceChange?.h24 || 0,
    marketCap: marketCap,
    volume24h: pair.volume?.h24 || 0,
    liquidity: liquidity,
    bscscanUrl: `https://bscscan.com/token/${pair.baseToken.address}`,
    website: pair.info?.websites?.[0]?.url,
    twitter: pair.info?.socials?.find((s: any) => s.type === 'twitter')?.url,
    telegram: pair.info?.socials?.find((s: any) => s.type === 'telegram')?.url,
  };
}

/**
 * 从 DexScreener 获取 BSC 链上的 boosted/trending 代币
 */
async function fetchBscTrendingFromDexScreener(): Promise<any[]> {
  try {
    // 获取最新的 token profiles（包含 boosted tokens）
    const response = await axios.get(DEXSCREENER_API);
    if (!response.data) return [];

    // 筛选 BSC 链的代币
    const bscTokens = response.data.filter((token: any) => token.chainId === 'bsc');

    // 获取这些代币的详细信息
    const allPairs: any[] = [];
    const batchSize = 30;

    for (let i = 0; i < bscTokens.length; i += batchSize) {
      const batch = bscTokens.slice(i, i + batchSize);
      const addresses = batch.map((t: any) => t.tokenAddress).join(',');

      try {
        const pairsResponse = await axios.get(`${DEXSCREENER_PAIRS_API}/tokens/${addresses}`);
        if (pairsResponse.data?.pairs) {
          allPairs.push(...pairsResponse.data.pairs);
        }
      } catch (err) {
        console.error('Error fetching token pairs:', err);
      }
    }

    return allPairs;
  } catch (error) {
    console.error('Error fetching BSC trending tokens:', error);
    return [];
  }
}

/**
 * 获取已知地址代币的详细信息
 */
async function fetchKnownAddressTokens(): Promise<any[]> {
  try {
    console.log('Fetching known Chinese MEME token addresses...');
    const addresses = KNOWN_CHINESE_MEME_ADDRESSES.join(',');
    const response = await axios.get(`${DEXSCREENER_PAIRS_API}/tokens/${addresses}`);
    return response.data?.pairs || [];
  } catch (error) {
    console.error('Error fetching known address tokens:', error);
    return [];
  }
}

/**
 * 从 CoinGecko 获取中文 MEME 分类代币
 */
async function fetchCoinGeckoChineseMeme(): Promise<string[]> {
  try {
    console.log('Fetching Chinese meme tokens from CoinGecko...');
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        category: 'chinese-meme',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    const coins = response.data || [];
    const addresses: string[] = [];

    // 获取每个代币在 BSC 上的合约地址
    for (const coin of coins.slice(0, 30)) { // 只处理前30个避免太多请求
      try {
        const coinDetail = await axios.get(`${COINGECKO_API}/coins/${coin.id}`, {
          params: { localization: false, tickers: false, community_data: false, developer_data: false }
        });
        const bscAddress = coinDetail.data?.platforms?.['binance-smart-chain'];
        if (bscAddress) {
          addresses.push(bscAddress);
        }
      } catch (err) {
        // 忽略单个代币获取失败
      }
    }

    console.log(`Found ${addresses.length} BSC addresses from CoinGecko Chinese meme category`);
    return addresses;
  } catch (error) {
    console.error('Error fetching CoinGecko Chinese meme tokens:', error);
    return [];
  }
}

/**
 * 从 Binance Alpha 获取代币列表
 */
async function fetchBinanceAlphaTokens(): Promise<string[]> {
  try {
    console.log('Fetching Binance Alpha tokens...');
    const response = await axios.get(BINANCE_ALPHA_API, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const tokens = response.data?.data || [];
    // 筛选 BSC 链上的代币
    const bscAddresses = tokens
      .filter((t: any) => t.network === 'BSC' || t.chainId === 56)
      .map((t: any) => t.contractAddress || t.address)
      .filter(Boolean);

    console.log(`Found ${bscAddresses.length} BSC tokens from Binance Alpha`);
    return bscAddresses;
  } catch (error) {
    console.error('Error fetching Binance Alpha tokens:', error);
    return [];
  }
}

/**
 * 获取中文 Meme 币（名称包含中文）
 * 通过多种方式获取更全面的列表
 */
export async function fetchChineseTrendingTokens(timeframe: '1h' | '6h' | '24h' = '1h'): Promise<MemeToken[]> {
  try {
    console.log(`Fetching Chinese trending tokens for ${timeframe}...`);

    const searchResults: MemeToken[] = [];
    const seenAddresses = new Set<string>();
    const seenSymbols = new Set<string>();

    // 已知地址集合（这些地址不需要中文字符检测）
    const knownAddressSet = new Set(KNOWN_CHINESE_MEME_ADDRESSES.map(a => a.toLowerCase()));

    // 辅助函数：添加代币到结果
    const addToken = (pair: any, skipChineseCheck = false) => {
      const name = pair.baseToken?.name || '';
      const symbol = pair.baseToken?.symbol || '';
      const marketCap = pair.marketCap || 0; // 只使用真实 marketCap，不用 fdv
      const address = pair.baseToken?.address?.toLowerCase();
      const normalizedSymbol = symbol.toLowerCase().replace(/\s+/g, '');

      // 基本筛选
      if (pair.chainId !== 'bsc' || !pair.priceUsd) return;
      if (marketCap < 1000000) return; // 市值 >= 100万美元（必须有真实市值数据）

      const liquidity = pair.liquidity?.usd || 0;
      const volume24h = pair.volume?.h24 || 0;

      // 流动性必须至少 $1000，否则代币无法正常交易
      if (liquidity < 1000) return;

      // 排除市值异常的代币（市值与流动性比例过高说明数据有问题）
      // 正常代币的市值/流动性比例通常在 1-100 之间
      if (marketCap > 1000000 && liquidity > 0) {
        const mcToLiqRatio = marketCap / liquidity;
        if (mcToLiqRatio > 1000) return; // 市值是流动性的1000倍以上，数据异常
      }

      // 排除市值异常的代币（超过10亿美元的需要特别验证）
      if (marketCap > 1000000000) {
        if (liquidity < 100000) return; // 流动性低于10万但市值超10亿，排除
      }

      // 排除已知的非中文代币
      const symbolLower = symbol.toLowerCase();
      const nameLower = name.toLowerCase();
      const isExcluded = EXCLUDED_TOKENS.some(excluded =>
        symbolLower === excluded ||
        nameLower === excluded ||
        symbolLower.includes(excluded) && !hasChineseCharacters(name) && !hasChineseCharacters(symbol)
      );
      if (isExcluded) return;

      // 必须包含中文字符（更严格的检查）
      const isKnownAddress = knownAddressSet.has(address);
      if (!isKnownAddress) {
        // 必须在名称或符号中有中文字符
        if (!hasChineseCharacters(name) && !hasChineseCharacters(symbol)) return;
      }

      if (seenAddresses.has(address) || seenSymbols.has(normalizedSymbol)) return;

      seenAddresses.add(address);
      seenSymbols.add(normalizedSymbol);
      searchResults.push(pairToMemeToken(pair));
    };

    // 方法0：先获取已知地址的代币（优先级最高）
    console.log('Fetching known address tokens...');
    const knownPairs = await fetchKnownAddressTokens();
    for (const pair of knownPairs) {
      addToken(pair, true); // 跳过中文检查
    }
    console.log(`Found ${searchResults.length} from known addresses`);

    // 方法1：从 DexScreener trending/boosted 获取
    console.log('Fetching from DexScreener trending...');
    const trendingPairs = await fetchBscTrendingFromDexScreener();
    for (const pair of trendingPairs) {
      addToken(pair);
    }
    console.log(`Found ${searchResults.length} after trending`);

    // 方法2：通过关键词搜索（分批并行，更多关键词同时搜索）
    console.log('Searching by keywords...');
    const batchSize = 20; // 每批20个关键词
    for (let i = 0; i < CHINESE_KEYWORDS.length; i += batchSize) {
      const batch = CHINESE_KEYWORDS.slice(i, i + batchSize);

      const promises = batch.map(async (keyword) => {
        try {
          const response = await axios.get(`${DEXSCREENER_PAIRS_API}/search?q=${encodeURIComponent(keyword)}`);
          return response.data?.pairs || [];
        } catch (err) {
          return [];
        }
      });

      const results = await Promise.all(promises);

      for (const pairs of results) {
        // 每个关键词最多取20个结果
        const topPairs = pairs.slice(0, 20);
        for (const pair of topPairs) {
          addToken(pair);
        }
      }
    }

    // 方法3：直接搜索 BSC 上的 meme 相关代币
    console.log('Searching for BSC meme tokens...');
    const memeSearchTerms = ['meme bsc', 'bsc meme', 'bnb meme', '中文'];
    for (const term of memeSearchTerms) {
      try {
        const response = await axios.get(`${DEXSCREENER_PAIRS_API}/search?q=${encodeURIComponent(term)}`);
        const pairs = response.data?.pairs || [];
        for (const pair of pairs.slice(0, 50)) {
          addToken(pair);
        }
      } catch (err) {
        // ignore
      }
    }
    console.log(`Found ${searchResults.length} after meme search`);

    // 方法4：从 CoinGecko 中文 MEME 分类获取地址
    console.log('Fetching from CoinGecko Chinese meme category...');
    try {
      const coingeckoAddresses = await fetchCoinGeckoChineseMeme();
      if (coingeckoAddresses.length > 0) {
        // 批量获取这些地址的详细信息
        const batchSize = 30;
        for (let i = 0; i < coingeckoAddresses.length; i += batchSize) {
          const batch = coingeckoAddresses.slice(i, i + batchSize);
          const addressList = batch.join(',');
          try {
            const response = await axios.get(`${DEXSCREENER_PAIRS_API}/tokens/${addressList}`);
            const pairs = response.data?.pairs || [];
            for (const pair of pairs) {
              // CoinGecko 的中文 MEME 分类也需要验证是否真的有中文
              addToken(pair);
            }
          } catch (err) {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error('Error in CoinGecko integration:', err);
    }
    console.log(`Found ${searchResults.length} after CoinGecko`);

    // 方法5：从 Binance Alpha 获取代币
    console.log('Fetching from Binance Alpha...');
    try {
      const binanceAddresses = await fetchBinanceAlphaTokens();
      if (binanceAddresses.length > 0) {
        // 批量获取这些地址的详细信息
        const batchSize = 30;
        for (let i = 0; i < binanceAddresses.length; i += batchSize) {
          const batch = binanceAddresses.slice(i, i + batchSize);
          const addressList = batch.join(',');
          try {
            const response = await axios.get(`${DEXSCREENER_PAIRS_API}/tokens/${addressList}`);
            const pairs = response.data?.pairs || [];
            for (const pair of pairs) {
              // Binance Alpha 代币需要检查是否包含中文
              addToken(pair);
            }
          } catch (err) {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error('Error in Binance Alpha integration:', err);
    }
    console.log(`Found ${searchResults.length} after Binance Alpha`);

    // 方法6：搜索 Four.meme 平台的热门代币（币安钱包合作平台）
    console.log('Fetching from Four.meme platform...');
    const fourMemeSearchTerms = ['four.meme', '4444', 'fourmeme'];
    for (const term of fourMemeSearchTerms) {
      try {
        const response = await axios.get(`${DEXSCREENER_PAIRS_API}/search?q=${encodeURIComponent(term)}`);
        const pairs = response.data?.pairs || [];
        // 只取 BSC 链上的，且需要有中文
        for (const pair of pairs.slice(0, 100)) {
          if (pair.chainId === 'bsc') {
            addToken(pair);
          }
        }
      } catch (err) {
        // ignore
      }
    }
    console.log(`Found ${searchResults.length} after Four.meme`);

    console.log(`Total found: ${searchResults.length} Chinese tokens`);

    // 按市值排序（默认）
    searchResults.sort((a, b) => b.marketCap - a.marketCap);

    // 获取缺少头像的代币
    const tokensWithoutIcon = searchResults.filter(t => !t.logoUrl);
    if (tokensWithoutIcon.length > 0) {
      console.log(`Fetching icons for ${tokensWithoutIcon.length} tokens...`);
      const addresses = tokensWithoutIcon.map(t => t.address);
      const iconMap = await fetchTokenIcons(addresses);

      // 更新代币头像
      for (const token of searchResults) {
        if (!token.logoUrl) {
          const icon = iconMap.get(token.address.toLowerCase());
          if (icon) {
            token.logoUrl = icon;
          }
        }
      }
    }

    // 返回前100个
    return searchResults.slice(0, 100);
  } catch (error) {
    console.error('Error fetching Chinese trending tokens:', error);
    return [];
  }
}
