import { Toaster } from 'sonner';

import '@/styles/globals.css';

import { type Metadata, type Viewport } from 'next';

import { fontSans } from '@/config/fonts';
import { APP_URL, siteConfig } from '@/config/site';

import { Providers } from './providers';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: siteConfig.name,
  description: siteConfig.description,
  generator: 'Next.js',
  applicationName: siteConfig.name,
  referrer: 'origin-when-cross-origin',
  keywords: [],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    images: [siteConfig.ogImage],
    description: siteConfig.description,
    title: {
      default: siteConfig.name,
      template: `${siteConfig.name} - %s`,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.name}`,
  },
};

export const viewport: Viewport = {
  width: 1,
  themeColor: [{ media: '(prefers-color-scheme: light)', color: 'white' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        suppressHydrationWarning
        className={cn('bg-[#f5f5f5] min-h-screen font-sans antialiased', fontSans.variable)}
      >
        <Providers>
          <Toaster position="top-right" />

          {children}
        </Providers>
      </body>
    </html>
  );
}
