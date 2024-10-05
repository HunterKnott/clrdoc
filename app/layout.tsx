import HeaderAuth from "@/components/header-auth";
import { Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

export const metadata = {
  title: "ClrDoc | Sell your Glasses",
  description: "A plug and play E-commerce platform for optometrists",
};

const montserrat = Montserrat({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="emerald" className="min-w-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${montserrat.className} bg-gray-100`}>
        {/* <HeaderAuth /> */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
