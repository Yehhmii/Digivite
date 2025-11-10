import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, DM_Serif_Display } from 'next/font/google';

const playfair = Playfair_Display({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-playfair',
});

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
});

export const metadata: Metadata = {
  title: "Digivite",
  description: "Getting the best with comfort.",
  openGraph: {
    title: "Digivite",
    description: "You are invited to celebrate with us.",
    url: "https://digivite-pro.vercel.app/",
    siteName: "Digivite",
    images: [
      {
        url: "/couple-2.jpeg",
        width: 1200,
        height: 630,
        alt: "Digivite - Getting the best with comfort",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digivite",
    description: "Getting the best with comfort.",
    images: ["/DigiviteLogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSerif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
