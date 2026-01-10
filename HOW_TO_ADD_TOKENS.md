# 如何添加中文 Meme 币到列表

## 方法一：手动添加（推荐）

编辑 `lib/chinese-meme-tokens.ts` 文件，在 `CHINESE_MEME_TOKENS` 数组中添加新的代币：

```typescript
{
  address: '0x代币合约地址',
  name: '代币全名',
  symbol: '代币符号',
  description: '中文描述',
  community: {
    telegram: 'https://t.me/群组',
    twitter: 'https://twitter.com/账号',
    website: 'https://网站地址',
  },
}
```

### 示例：

```typescript
{
  address: '0xABC123...',
  name: '旺财币',
  symbol: 'WANGCAI',
  description: '中国本土的 meme 币，有活跃的中文社区',
  community: {
    telegram: 'https://t.me/wangcai_cn',
    twitter: 'https://twitter.com/WangCaiToken',
    website: 'https://wangcai.com',
  },
}
```

## 方法二：在哪里找 BSC 的中文 Meme 币？

### 1. PancakeSwap
- 网址：https://pancakeswap.finance/
- 查看"最新上线"和"热门"代币
- 确保选择 BSC (BNB Chain)

### 2. CoinMarketCap
- 网址：https://coinmarketcap.com/
- 筛选条件：
  - Platform: BNB Smart Chain (BEP20)
  - Categories: Meme
  - 按交易量排序

### 3. CoinGecko
- 网址：https://www.coingecko.com/
- 筛选：BNB Smart Chain
- 类别：Meme Tokens

### 4. DexScreener
- 网址：https://dexscreener.com/
- 选择 BSC 链
- 查看热门和新上线的代币

### 5. 中文加密社区
- Telegram 中文加密货币群组
- Twitter 中文加密 KOL
- Discord 中文社区

## 如何获取代币合约地址？

1. 在 PancakeSwap 搜索代币
2. 点击代币信息
3. 找到"Contract"地址
4. 或者在 BscScan.com 搜索代币名称

## 验证代币安全性

⚠️ 添加代币前请务必检查：

1. **在 BscScan 验证合约**
   - https://bscscan.com/token/[合约地址]
   - 查看是否通过验证
   - 检查持有人数量

2. **检查流动性**
   - 流动性是否充足
   - 是否有锁定流动性

3. **社区活跃度**
   - Telegram/Twitter 是否活跃
   - 是否有官方网站
   - 团队是否公开

4. **避免骗局**
   - 警惕"蜜罐"代币（只能买不能卖）
   - 检查合约是否有后门
   - 使用工具如 TokenSniffer 检测

## API 数据源说明

当前使用的是 **DexScreener API**，优点：
- ✅ 免费，无需 API key
- ✅ 实时价格数据
- ✅ 支持 BSC
- ❌ 可能有速率限制

### 可选的其他 API：

1. **PancakeSwap API**
   ```
   https://api.pancakeswap.info/api/v2/tokens/[地址]
   ```

2. **BscScan API**（需要 API key）
   ```
   https://api.bscscan.com/api
   ```
   - 注册获取免费 API key：https://bscscan.com/apis

3. **CoinGecko API**（免费）
   ```
   https://api.coingecko.com/api/v3/
   ```

4. **CoinMarketCap API**（需要 API key）
   ```
   https://pro-api.coinmarketcap.com/v1/
   ```

## 更新步骤

1. 编辑 `lib/chinese-meme-tokens.ts`
2. 添加新的代币信息
3. 保存文件
4. 刷新浏览器页面
5. 点击"Refresh"按钮加载新数据

不需要重启服务器，Next.js 会自动热重载！
