import { Toaster } from 'sonner';

import '@/styles/globals.css';

import { type Metadata, type Viewport } from 'next';
import clsx from 'clsx';

import { fontSans } from '@/config/fonts';
import { APP_URL, siteConfig } from '@/config/site';
import { VStack } from '@/components/ui/Utilities';
import MainLayout from '@/components/layouts/MainLayout';

import { Providers } from './providers';

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
        className={clsx('bg-background min-h-screen font-sans antialiased', fontSans.variable)}
      >
        <Providers>
          <Toaster />

          <VStack justify={'center'} align={'center'} className="min-h-screen hidden lg:flex">
            <span className="text-3xl text-white">Only support for mobile</span>
          </VStack>

          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
