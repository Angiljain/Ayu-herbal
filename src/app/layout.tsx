import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Ayu Herbal — Organic Skincare & Handmade Crafts',
    template: '%s | Ayu Herbal',
  },
  description: 'Pure, organic, and premium herbal products and handmade crafts crafted with love. Ayu Herbal brings ancient wellness directly to your home.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  keywords: ['ayurveda', 'herbal hair oil', 'handmade crafts', 'gulab jal', 'organic skin care', 'india wellness'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ayuherbal.com',
    siteName: 'Ayu Herbal',
    images: [
      {
        url: 'https://res.cloudinary.com/dydt2w8g8/image/upload/v1716300000/ayu-herbal-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Ayu Herbal — Pure, Organic, Handmade',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#1b5e20',
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
    <html lang="en" className={`${outfit.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌿</text></svg>" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        {children}
      </body>
    </html>
  );
}
