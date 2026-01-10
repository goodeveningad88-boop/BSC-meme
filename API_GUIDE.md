# BSC Meme 币 API 使用指南

本项目集成了多个 API 来获取 BSC (BNB Chain) 上的 meme 币数据。

## 🔄 混合 API 策略

项目使用**混合策略**，自动选择最佳数据源：

1. **PancakeSwap API**（优先）→ BSC 上最大的 DEX，数据最准确
2. **DexScreener API**（回退）→ 跨链 DEX 聚合器，功能更丰富

## 📊 API 数据源对比

### 1. PancakeSwap API ⭐推荐用于 BSC

**优点：**
- ✅ 完全免费，无需 API Key
- ✅ BSC 原生数据，最准确
- ✅ 实时价格和流动性
- ✅ 稳定性高

**缺点：**
- ❌ 只支持 BSC
- ❌ 数据字段相对简单
- ❌ 无 24h 涨跌幅数据

**端点：**
```
https://api.pancakeswap.info/api/v2/tokens
https://api.pancakeswap.info/api/v2/tokens/[地址]
```

**文件：** `lib/pancakeswap-api.ts`

---

### 2. DexScreener API ⭐推荐用于多链

**优点：**
- ✅ 完全免费，无需 API Key
- ✅ 支持多条链（BSC, ETH, SOL 等）
- ✅ 数据字段丰富（24h 涨跌幅、交易量等）
- ✅ 支持搜索功能

**缺点：**
- ❌ 有速率限制
- ❌ 响应可能较慢

**端点：**
```
https://api.dexscreener.com/latest/dex/tokens/[地址]
https://api.dexscreener.com/latest/dex/search?q=[关键词]
```

**文件：** `lib/api.ts`, `lib/hybrid-api.ts`

---

### 3. BscScan API（可选）

**优点：**
- ✅ 官方区块链浏览器 API
- ✅ 代币持有人、总供应量等链上数据
- ✅ 社交媒体链接、官网等元数据
- ✅ 免费版额度足够

**缺点：**
- ❌ 需要注册获取 API Key
- ❌ 无价格数据
- ❌ 有速率限制（免费版 5 calls/sec）

**获取 API Key：**
1. 访问 https://bscscan.com/
2. 注册/登录账号
3. 访问 https://bscscan.com/myapikey
4. 创建免费 API Key

**配置：**
在项目根目录创建 `.env.local` 文件：
```bash
NEXT_PUBLIC_BSCSCAN_API_KEY=你的API密钥
```

**文件：** `lib/bscscan-api.ts`

---

### 4. 币安钱包 API（不适用）

这是**浏览器扩展 API**，用于连接钱包，**不适合**获取代币列表：
- 需要用户安装币安钱包扩展
- 主要用于 Web3 交互（签名、发送交易等）
- 类似 MetaMask API

❌ **不推荐用于本项目**

---

## 🚀 当前实现

### 数据获取流程

```
用户点击刷新
    ↓
1. 获取配置的中文 meme 币
   ├─ 尝试 PancakeSwap API
   └─ 失败 → 使用 DexScreener API
    ↓
2. 搜索热门关键词
   └─ 使用 DexScreener Search API
    ↓
3. 合并去重
    ↓
4. 显示结果（如果全失败，显示演示数据）
```

### 关键文件

- `lib/api.ts` - 主 API 接口
- `lib/hybrid-api.ts` - 混合策略实现
- `lib/pancakeswap-api.ts` - PancakeSwap 集成
- `lib/bscscan-api.ts` - BscScan 集成（可选）
- `lib/chinese-meme-tokens.ts` - 中文 meme 币配置

---

## 🛠️ 如何切换 API

### 只使用 PancakeSwap

编辑 `lib/hybrid-api.ts`，注释掉 DexScreener 回退：

```typescript
export async function fetchChineseMemeTokens(): Promise<MemeToken[]> {
  // 只使用 PancakeSwap
  const pancakeTokens = await fetchPancakeSwapTokensByAddresses(addresses);
  return pancakeTokens.map(...);

  // 删除或注释掉 DexScreener 回退代码
}
```

### 只使用 DexScreener

保持 `lib/api.ts` 当前实现即可（已经在用）。

### 添加 BscScan 元数据

在 `lib/hybrid-api.ts` 中：

```typescript
import { fetchBscScanTokenInfo } from './bscscan-api';

// 获取额外的元数据
const bscScanInfo = await fetchBscScanTokenInfo(address);
if (bscScanInfo) {
  token.website = bscScanInfo.website;
  token.twitter = bscScanInfo.twitter;
  // ...
}
```

---

## 📈 API 速率限制

| API | 免费额度 | 限制 |
|-----|---------|------|
| PancakeSwap | 无限制 | 响应缓存 5 分钟 |
| DexScreener | 未公开 | 建议控制请求频率 |
| BscScan | 5 calls/sec | 免费版，可升级 |

**建议：**
- 不要频繁刷新（建议间隔 > 30秒）
- 使用缓存减少 API 调用
- 考虑在后端实现定时任务更新数据

---

## 🔍 其他可选 API

### CoinGecko API（免费）
```
https://api.coingecko.com/api/v3/coins/markets
?vs_currency=usd&category=binance-smart-chain
```
- 限制：30 calls/min（免费版）

### CoinMarketCap API（需要 Key）
```
https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
```
- 需要注册 API Key
- 免费版：333 calls/day

### Bitquery（需要 Key）
```
https://graphql.bitquery.io/
```
- GraphQL API
- 需要注册

---

## ❓ 常见问题

### Q: 为什么看不到代币？
A: 可能是 API 速率限制。等待 1-2 分钟后刷新，或检查浏览器控制台的错误信息。

### Q: 如何添加更多代币？
A: 编辑 `lib/chinese-meme-tokens.ts`，添加代币合约地址。

### Q: 数据不准确怎么办？
A: 可以配置 BscScan API Key 获取更准确的链上数据，或等待 PancakeSwap 缓存更新（5分钟）。

### Q: 能否支持其他链？
A: 可以！DexScreener 支持多链。修改 `chainId` 过滤条件即可（如 'ethereum', 'solana'）。

---

## 📚 相关文档

- [PancakeSwap API](https://github.com/pancakeswap/pancake-info-api)
- [DexScreener API](https://docs.dexscreener.com/)
- [BscScan API](https://docs.bscscan.com/)
- [Binance Wallet API](https://binance-wallet.gitbook.io/)
