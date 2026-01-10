import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BNB Chain Meme Tokens",
  description: "Track trending meme tokens on BNB Chain (BSC) with real-time prices, market cap, and volume data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
