import { Inter, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import ReduxProvider from '@/store/Provider';
import { Toaster } from '@/components/ui/sonner';
import { SocketProvider } from '@/contexts/SocketContext';
import { Suspense } from 'react';
import Preloader from '@/components/Preloader';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'The LawAppOnline',
  description:
    'The Law App is a complete online marketplace for people to search for lawyers at a price they can afford and for lawyers to build an online presence to find clients without the need for heavy marketing expenses. We match clients to lawyers directly based on their field of expertise and allow fair bidding to reach the right price.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ReduxProvider>
          <Suspense fallback={<Preloader />}>
            <SocketProvider>
              <Toaster />
              {children}
            </SocketProvider>
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
