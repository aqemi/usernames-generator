import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import { Sono } from 'next/font/google';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import logo from './logo.png';
import './globals.css';

const font = Sono({ weight: ['400', '700', '800'], subsets: ['latin'] });

const title = 'Usernames Generator';
const description =
  'Generate unique and creative usernames effortlessly with our user-friendly username generator app. Discover personalized usernames for your online accounts and enhance your digital identity.';
export const metadata: Metadata = {
  title,
  description,
  icons: [
    {
      rel: 'icon',
      sizes: 'any',
      url: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/apple-touch-icon.png',
    },
  ],
  manifest: '/site.webmanifest',
  openGraph: {
    title,
    description: 'Generate unique and creative usernames effortlessly with our user-friendly username generator app',
    type: 'website',
    images: logo.src,
  },
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http:localhost:3000'
  ),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx('min-h-screen h-screen flex flex-col p-4 select-none', font.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme disableTransitionOnChange>
          {children}
          <Toaster richColors visibleToasts={1} />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
