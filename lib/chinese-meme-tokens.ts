// BSC 上的中文 meme 币列表
// 你可以手动添加和更新这个列表

export interface ChineseMemeToken {
  address: string;
  name: string;
  symbol: string;
  description: string; // 中文描述
  community: {
    telegram?: string;
    twitter?: string;
    website?: string;
  };
}

// 手动维护的中文 meme 币列表
// 🔥 2025-2026 热门中国本土 Meme 币
export const CHINESE_MEME_TOKENS: ChineseMemeToken[] = [
  // 🇨🇳 纯中文社区 Meme 币（需要你添加实际合约地址）
  // 提示：访问 Four.meme、Binance Alpha、PancakeSwap 查找最新的中文 meme 币

  // 示例：币安人生（Binance Life）
  // 合约地址需要在 BscScan 或 Four.meme 上查找
  // {
  //   address: '0x...',
  //   name: '币安人生',
  //   symbol: 'BNBLIFE',
  //   description: '源自抖音梗"开币安汽车，住币安小区"，首个上线Binance Alpha的中文Meme',
  //   community: {
  //     telegram: 'https://t.me/...',
  //     twitter: 'https://twitter.com/...',
  //   },
  // },

  // 示例：DDDD
  // {
  //   address: '0x...',
  //   name: 'DDDD',
  //   symbol: 'DDDD',
  //   description: '带带弟弟/懂得都懂，Four平台宕机期间爆火的中文梗',
  //   community: {
  //     telegram: 'https://t.me/...',
  //   },
  // },

  // 🌍 有中文社区的国际 Meme 币
  {
    address: '0xc748673057861a797275CD8A068AbB95A902e8de',
    name: 'Baby Doge Coin',
    symbol: 'BabyDoge',
    description: '狗狗币的"儿子"，有活跃的中文社区',
    community: {
      telegram: 'https://t.me/babydogecoin_cn',
      twitter: 'https://twitter.com/BabyDogeCoin',
      website: 'https://babydoge.com',
    },
  },
  {
    address: '0xfb5B838b6cfEEdC2873aB27866079AC55363D37E',
    name: 'FLOKI',
    symbol: 'FLOKI',
    description: '以马斯克的狗命名，有中文社区支持',
    community: {
      telegram: 'https://t.me/FlokiInuToken',
      twitter: 'https://twitter.com/RealFlokiInu',
      website: 'https://floki.com',
    },
  },
  {
    address: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
    name: 'SHIBA INU',
    symbol: 'SHIB',
    description: '柴犬币，最知名的 meme 币之一，在中国有大量粉丝',
    community: {
      twitter: 'https://twitter.com/Shibtoken',
      website: 'https://shibatoken.com',
    },
  },

  // 📝 如何找到更多中文 Meme 币：
  // 1. Four.meme 平台 - 币安推出的 Meme Rush 平台
  // 2. Binance Alpha - 新上线的早期代币
  // 3. 中文 Crypto Twitter/推特 - 搜索 #BSC #Meme #中文社区
  // 4. Telegram 中文群组 - BSC 中文社区、Meme 币讨论组
  // 5. BscScan 新代币列表 - https://bscscan.com/tokens
];

// 获取所有中文 meme 币的合约地址
export function getChineseMemeTokenAddresses(): string[] {
  return CHINESE_MEME_TOKENS.map(token => token.address);
}

// 根据地址获取代币信息
export function getTokenInfoByAddress(address: string): ChineseMemeToken | undefined {
  return CHINESE_MEME_TOKENS.find(
    token => token.address.toLowerCase() === address.toLowerCase()
  );
}
