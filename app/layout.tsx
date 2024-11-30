import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WalletProvider } from '@/contexts/WalletContext';
import { Toaster } from 'react-hot-toast';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#1A1B1F',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              success: {
                style: {
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                },
              },
              error: {
                style: {
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                },
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}
