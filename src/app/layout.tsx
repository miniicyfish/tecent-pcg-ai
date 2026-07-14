import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '庆余年 · 水下',
  description: '每部剧都是一座冰山。你看到的，只是水面以上。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
