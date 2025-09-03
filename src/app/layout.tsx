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
