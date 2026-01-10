# BNB Chain Meme Token List

A modern web application to track trending meme tokens on BNB Chain (Binance Smart Chain) with real-time prices, market cap, volume, and more.

## Features

- **Real-time Data**: Fetches live data from DexScreener API
- **Comprehensive Information**: Displays price, 24h change, market cap, volume, and liquidity
- **Contract Details**: Shows contract addresses with one-click copy
- **External Links**: Direct links to BscScan, official websites, Twitter, and Telegram
- **Sorting Options**: Sort tokens by market cap, volume, or price change
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic dark/light theme based on system preferences

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Source**: DexScreener API
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

Make sure you have Node.js installed (version 18 or higher recommended).

### Installation

1. Navigate to the project directory:
```bash
cd bnb-meme-list
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
bnb-meme-list/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── TokenCard.tsx     # Individual token display card
│   └── TokenList.tsx     # Token list with sorting
├── lib/                   # Utility functions
│   └── api.ts            # API integration and helpers
├── types/                 # TypeScript type definitions
│   └── index.ts          # Token and API types
├── public/                # Static assets
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── next.config.js        # Next.js configuration
```

## How It Works

1. **Data Fetching**: The app uses the DexScreener API to fetch trending tokens on BNB Chain
2. **Display**: Tokens are displayed in a grid layout with detailed information
3. **Sorting**: Users can sort tokens by market cap, volume, or 24h price change
4. **Refresh**: Data can be manually refreshed with the refresh button
5. **Navigation**: Direct links allow users to view tokens on BscScan or visit official channels

## Customization

### Adding More Tokens

Edit the `POPULAR_MEME_TOKENS` array in [lib/api.ts](lib/api.ts) to track specific tokens:

```typescript
const POPULAR_MEME_TOKENS = [
  '0x...', // Add contract addresses here
];
```

### Changing API Source

The app uses DexScreener API by default. You can modify [lib/api.ts](lib/api.ts) to use other data sources like:
- CoinGecko API
- CoinMarketCap API
- Direct blockchain queries with Web3

### Styling

Modify [tailwind.config.ts](tailwind.config.ts) to customize colors, spacing, and other design tokens.

## API Information

This project uses the **DexScreener API** which is free and doesn't require an API key. However, please be aware of rate limits.

API Documentation: https://docs.dexscreener.com/

## Important Notes

- **Not Financial Advice**: This tool is for informational purposes only
- **DYOR**: Always do your own research before investing in any token
- **Risk Warning**: Meme tokens are highly volatile and risky
- **Scam Alert**: Beware of scams, rug pulls, and pump-and-dump schemes

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with default settings

### Other Platforms

This Next.js app can be deployed to:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

## Contributing

Feel free to submit issues or pull requests to improve this project.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Disclaimer

This project is not affiliated with Binance, BNB Chain, or DexScreener. Token data is provided as-is and may not always be accurate. Use at your own risk.
