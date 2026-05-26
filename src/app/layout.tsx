import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI 产品交付工作台',
    template: '%s | AI 产品交付工作台',
  },
  description:
    '把混乱页面、截图、想法和 AI 生成结果，整理成可评审、可交付、研发能接手的产品资产。',
  keywords: [
    '产品交付',
    'PRD',
    '功能结构图',
    '线框图',
    '产品经理',
    'AI 助手',
  ],
  authors: [{ name: 'AI Product Delivery Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 antialiased">
        <Inspector keys={['control', 'shift', 'command']}>{children}</Inspector>
      </body>
    </html>
  );
}
