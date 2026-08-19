import { Metadata, Viewport } from 'next';

import './globals.css';

import { Inter } from 'next/font/google';

import { PWARegistrar } from '@/components/PWARegistrar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jalan Rusak - Laporan Jalan Rusak',
  description: 'Aplikasi pelaporan jalan rusak untuk memudahkan masyarakat melaporkan kondisi jalan yang rusak',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Jalan Rusak',
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  colorScheme: 'light',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <PWARegistrar />
        {children}
      </body>
    </html>
  );
}
